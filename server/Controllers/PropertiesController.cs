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
    public class PropertiesController : ControllerBase
    {
        private readonly PaperDbContext _context;
        private readonly IMapper _mapper;

        public PropertiesController(PaperDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // POST: api/admin/Properties
        [HttpPost]
        public async Task<ActionResult<PropertyDTO>> CreateProperty(PropertyDTO propertyDto)
        {
            var property = _mapper.Map<Property>(propertyDto);
            _context.Properties.Add(property);
            await _context.SaveChangesAsync();

            var resultDto = _mapper.Map<PropertyDTO>(property);
            return CreatedAtAction(nameof(GetPropertyById), new { id = property.Id }, resultDto);
        }

        // POST: api/admin/Properties/5/AddToProduct/10
        [HttpPost("{propertyId}/AddToProduct/{productId}")]
        public async Task<IActionResult> AddPropertyToProduct(int propertyId, int productId)
        {
            var property = await _context.Properties.FindAsync(propertyId);
            var product = await _context.Papers
                .Include(p => p.Properties)
                .FirstOrDefaultAsync(p => p.Id == productId);

            if (property == null || product == null)
                return NotFound();

            if (!product.Properties.Contains(property))
            {
                product.Properties.Add(property);
                await _context.SaveChangesAsync();
            }

            return NoContent();
        }

        // GET: api/admin/Properties/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PropertyDTO>> GetPropertyById(int id)
        {
            var property = await _context.Properties.FindAsync(id);
            if (property == null)
                return NotFound();

            var propertyDto = _mapper.Map<PropertyDTO>(property);
            return Ok(propertyDto);
        }
        
        // GET: api/Properties
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PropertyDTO>>> GetAllProperties()
        {
            var properties = await _context.Properties.ToListAsync();
            var propertyDtos = _mapper.Map<List<PropertyDTO>>(properties);
            return Ok(propertyDtos);
        }
    }
}
