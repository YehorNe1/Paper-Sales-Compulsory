using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.DTOs;
using server.Models;
using AutoMapper;
using server.DataAccess;

namespace server.Controllers
{
    [ApiController]
    [Route("api/admin/[controller]")]
    public class AdminOrdersController : ControllerBase
    {
        private readonly PaperDbContext _context;
        private readonly IMapper _mapper;

        public AdminOrdersController(PaperDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET: api/admin/Orders
        [HttpGet]
        public async Task<ActionResult<IEnumerable<OrderDTO>>> GetAllOrders()
        {
            var orders = await _context.Orders
                .Include(o => o.Customer)
                .Include(o => o.OrderEntries)
                .ThenInclude(oe => oe.Product)
                .ToListAsync();

            var orderDtos = _mapper.Map<List<OrderDTO>>(orders);
            return Ok(orderDtos);
        }
        
        //Update the status of an order
        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateOrderStatus(int id, [FromBody] UpdateOrderStatusDTO updateStatusDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var order = await _context.Orders.FindAsync(id);
            if (order == null)
            {
                return NotFound(new { Message = $"Order with ID {id} not found." });
            }

            order.Status = updateStatusDto.Status;
            // Optionally, you can update the DeliveryDate or other related fields here

            try
            {
                _context.Orders.Update(order);
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException ex)
            {
                // Log the exception (ex) as needed
                return StatusCode(500, new { Message = "An error occurred while updating the order status." });
            }

            return NoContent();
        }
    }
}