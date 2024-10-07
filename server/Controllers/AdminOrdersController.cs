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
    }
}