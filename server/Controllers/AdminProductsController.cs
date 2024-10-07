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
    public class AdminProductsController : ControllerBase
    {
        private readonly PaperDbContext _context;
        private readonly IMapper _mapper;

        public AdminProductsController(PaperDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // POST: api/admin/Products
        [HttpPost]
        public async Task<ActionResult<PaperDTO>> CreateProduct(PaperDTO paperDto)
        {
            var product = _mapper.Map<Paper>(paperDto);
            _context.Papers.Add(product);
            await _context.SaveChangesAsync();

            var resultDto = _mapper.Map<PaperDTO>(product);
            return CreatedAtAction(nameof(GetProductById), new { id = product.Id }, resultDto);
        }

        // PUT: api/admin/Products/5/Discontinue
        [HttpPut("{id}/Discontinue")]
        public async Task<IActionResult> DiscontinueProduct(int id)
        {
            var product = await _context.Papers.FindAsync(id);
            if (product == null)
                return NotFound();

            product.Discontinued = true;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // PUT: api/admin/Products/5/Restock
        [HttpPut("{id}/Restock")]
        public async Task<IActionResult> RestockProduct(int id, [FromBody] int quantity)
        {
            if (quantity <= 0)
                return BadRequest("Quantity must be greater than zero.");

            var product = await _context.Papers.FindAsync(id);
            if (product == null)
                return NotFound();

            product.Stock += quantity;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // GET: api/admin/Products/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PaperDTO>> GetProductById(int id)
        {
            var product = await _context.Papers
                .Include(p => p.Properties)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (product == null)
                return NotFound();

            var productDto = _mapper.Map<PaperDTO>(product);
            return Ok(productDto);
        }
        
        // GET: api/admin/Products
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PaperDTO>>> GetAllProducts()
        {
            var products = await _context.Papers
                .Include(p => p.Properties)
                .ToListAsync();

            var productDtos = _mapper.Map<List<PaperDTO>>(products);
            return Ok(productDtos);
        }
    }
}
