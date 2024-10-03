using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using server.DataAccess;
using server.DTOs;
using server.Models;

namespace server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrderController : ControllerBase
    {
        private readonly PaperDbContext _context;
        private readonly AdminSettings _adminSettings;

        public OrderController(PaperDbContext context, IOptions<AdminSettings> adminSettings)
        {
            _context = context;
            _adminSettings = adminSettings.Value;
        }

        // GET: api/Order
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Order>>> GetOrders()
        {
            return await _context.Orders
                                 .Include(o => o.OrderEntries)
                                     .ThenInclude(oe => oe.Product)
                                 .Include(o => o.Customer)
                                 .ToListAsync();
        }

        // GET: api/Order/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Order>> GetOrder(int id)
        {
            var order = await _context.Orders
                                      .Include(o => o.OrderEntries)
                                          .ThenInclude(oe => oe.Product)
                                      .Include(o => o.Customer)
                                      .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null)
            {
                return NotFound("Order not found.");
            }

            return order;
        }

        // POST: api/Order/Place
        [HttpPost("Place")]
        public async Task<ActionResult<Order>> PlaceOrder(OrderPlacementDto orderDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Validate customer
            var customer = await _context.Customers.FindAsync(orderDto.CustomerId);
            if (customer == null)
            {
                return BadRequest("Invalid Customer ID.");
            }

            // Fetch all products involved in the order
            var productIds = orderDto.OrderEntries.Select(oe => oe.ProductId).ToList();
            var products = await _context.Papers
                                         .Where(p => productIds.Contains(p.Id) && !p.Discontinued)
                                         .ToListAsync();

            if (products.Count != productIds.Count)
            {
                return BadRequest("One or more products are invalid or discontinued.");
            }

            // Check stock and calculate total amount
            double totalAmount = 0;
            foreach (var entry in orderDto.OrderEntries)
            {
                var product = products.First(p => p.Id == entry.ProductId);
                if (product.Stock < entry.Quantity)
                {
                    return BadRequest($"Insufficient stock for product {product.Name}.");
                }
                totalAmount += product.Price * entry.Quantity;
                product.Stock -= entry.Quantity; // Deduct stock
            }

            // Create the order
            var order = new Order
            {
                CustomerId = orderDto.CustomerId,
                OrderDate = orderDto.OrderDate,
                DeliveryDate = orderDto.DeliveryDate,
                Status = orderDto.Status,
                TotalAmount = totalAmount
            };

            _context.Orders.Add(order);
            await _context.SaveChangesAsync(); // Save to get Order ID

            // Create order entries
            foreach (var entryDto in orderDto.OrderEntries)
            {
                var orderEntry = new OrderEntry
                {
                    OrderId = order.Id,
                    ProductId = entryDto.ProductId,
                    Quantity = entryDto.Quantity
                };
                _context.OrderEntries.Add(orderEntry);
            }

            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetOrder), new { id = order.Id }, order);
        }

        // PUT: api/Order/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutOrder(int id, Order order)
        {
            if (id != order.Id)
            {
                return BadRequest("Order ID mismatch.");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.Entry(order).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Orders.Any(e => e.Id == id))
                {
                    return NotFound("Order not found.");
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/Order/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrder(int id)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null)
            {
                return NotFound("Order not found.");
            }

            _context.Orders.Remove(order);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // PUT: api/Order/5/Status
        [HttpPut("{id}/Status")]
        public async Task<IActionResult> UpdateOrderStatus(int id, UpdateOrderStatusDto statusDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var order = await _context.Orders.FindAsync(id);
            if (order == null)
            {
                return NotFound("Order not found.");
            }

            order.Status = statusDto.Status;
            _context.Entry(order).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }
        
        // GET: api/Order/All
        [HttpGet("All")]
        public async Task<ActionResult<IEnumerable<Order>>> GetAllOrders(
            [FromQuery] string adminKey,
            [FromQuery] int? customerId,
            [FromQuery] string? status,
            [FromQuery] DateTime? startDate,
            [FromQuery] DateTime? endDate)
        {
            // Validate adminKey
            if (string.IsNullOrEmpty(adminKey) || adminKey != _adminSettings.AdminKey)
            {
                return Unauthorized("Invalid or missing admin key.");
            }

            var query = _context.Orders
                .Include(o => o.OrderEntries)
                .ThenInclude(oe => oe.Product)
                .Include(o => o.Customer)
                .AsQueryable();

            if (customerId.HasValue)
            {
                query = query.Where(o => o.CustomerId == customerId.Value);
            }

            if (!string.IsNullOrEmpty(status))
            {
                query = query.Where(o => o.Status.Equals(status, StringComparison.OrdinalIgnoreCase));
            }

            if (startDate.HasValue)
            {
                query = query.Where(o => o.OrderDate >= startDate.Value);
            }

            if (endDate.HasValue)
            {
                query = query.Where(o => o.OrderDate <= endDate.Value);
            }

            var orders = await query.ToListAsync();
            return Ok(orders);
        }
    }
}