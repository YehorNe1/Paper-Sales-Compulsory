using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.DTOs;
using server.Models;
using AutoMapper;
using server.DataAccess;

namespace server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly PaperDbContext _context;
        private readonly IMapper _mapper;

        public OrdersController(PaperDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // POST: api/Orders
        [HttpPost]
        public async Task<ActionResult<OrderDTO>> PlaceOrder(OrderDTO orderDto)
        {
            // Validate CustomerId
            if (orderDto.CustomerId <= 0)
            {
                return BadRequest("CustomerId is required.");
            }

            // Validate Customer exists
            var customer = await _context.Customers.FindAsync(orderDto.CustomerId);
            if (customer == null)
            {
                return NotFound($"Customer with ID {orderDto.CustomerId} not found.");
            }

            // Map DTO to entity
            var order = _mapper.Map<Order>(orderDto);
            order.OrderDate = DateTime.UtcNow;
            order.Status = "Pending";

            // Validate product availability and calculate total amount
            double totalAmount = 0;
            var orderEntries = new List<OrderEntry>();

            foreach (var entryDto in orderDto.OrderEntries)
            {
                var product = await _context.Papers.FindAsync(entryDto.ProductId);
                if (product == null || product.Discontinued)
                {
                    return BadRequest($"Product with ID {entryDto.ProductId} is not available.");
                }
                if (product.Stock < entryDto.Quantity)
                {
                    return BadRequest($"Insufficient stock for product ID {entryDto.ProductId}.");
                }

                // Reduce stock
                product.Stock -= entryDto.Quantity;

                // Calculate total amount
                totalAmount += product.Price * entryDto.Quantity;

                var orderEntry = new OrderEntry
                {
                    ProductId = entryDto.ProductId,
                    Quantity = entryDto.Quantity,
                    // OrderId will be set when the order is saved
                };
                orderEntries.Add(orderEntry);
            }

            order.TotalAmount = totalAmount;
            order.OrderEntries = orderEntries;

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            var resultDto = _mapper.Map<OrderDTO>(order);
            return CreatedAtAction(nameof(GetOrderById), new { id = order.Id }, resultDto);
        }

        // GET: api/Orders/5
        [HttpGet("{id}")]
        public async Task<ActionResult<OrderDTO>> GetOrderById(int id)
        {
            var order = await _context.Orders
                .Include(o => o.OrderEntries)
                .ThenInclude(oe => oe.Product)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null)
                return NotFound();

            var orderDto = _mapper.Map<OrderDTO>(order);
            return Ok(orderDto);
        }

        // GET: api/Orders/Customer/5
        [HttpGet("Customer/{customerId}")]
        public async Task<ActionResult<IEnumerable<OrderDTO>>> GetOrdersByCustomerId(int customerId)
        {
            // Validate Customer exists
            var customer = await _context.Customers.FindAsync(customerId);
            if (customer == null)
            {
                return NotFound($"Customer with ID {customerId} not found.");
            }

            var orders = await _context.Orders
                .Where(o => o.CustomerId == customerId)
                .Include(o => o.OrderEntries)
                .ThenInclude(oe => oe.Product)
                .ToListAsync();

            var orderDtos = _mapper.Map<List<OrderDTO>>(orders);
            return Ok(orderDtos);
        }
    }
}
