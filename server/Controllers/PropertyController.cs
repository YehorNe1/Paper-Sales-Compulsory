using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.DataAccess;
using server.DTOs;
using server.Models;

namespace server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PropertyController : ControllerBase
    {
        private readonly PaperDbContext _context;

        public PropertyController(PaperDbContext context)
        {
            _context = context;
        }

        // GET: api/Property
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Property>>> GetProperties()
        {
            return await _context.Properties
                                 .Include(p => p.Papers)
                                 .ToListAsync();
        }

        // GET: api/Property/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Property>> GetProperty(int id)
        {
            var property = await _context.Properties
                                         .Include(p => p.Papers)
                                         .FirstOrDefaultAsync(p => p.Id == id);

            if (property == null)
            {
                return NotFound("Property not found.");
            }

            return property;
        }

        // POST: api/Property
        [HttpPost]
        public async Task<ActionResult<Property>> PostProperty(Property property)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.Properties.Add(property);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetProperty), new { id = property.Id }, property);
        }

        // PUT: api/Property/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutProperty(int id, Property property)
        {
            if (id != property.Id)
            {
                return BadRequest("Property ID mismatch.");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.Entry(property).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Properties.Any(e => e.Id == id))
                {
                    return NotFound("Property not found.");
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/Property/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProperty(int id)
        {
            var property = await _context.Properties.FindAsync(id);
            if (property == null)
            {
                return NotFound("Property not found.");
            }

            _context.Properties.Remove(property);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // POST: api/Property/AssignToPaper
        [HttpPost("AssignToPaper")]
        public async Task<IActionResult> AssignPropertyToPaper(AssignPropertyDto dto)
        {
            var paper = await _context.Papers.Include(p => p.Properties)
                                            .FirstOrDefaultAsync(p => p.Id == dto.PaperId);
            if (paper == null)
            {
                return NotFound("Paper not found.");
            }

            var property = await _context.Properties.FindAsync(dto.PropertyId);
            if (property == null)
            {
                return NotFound("Property not found.");
            }

            if (paper.Properties.Any(p => p.Id == property.Id))
            {
                return BadRequest("Property already assigned to this paper.");
            }

            paper.Properties.Add(property);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
