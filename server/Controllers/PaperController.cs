using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.DataAccess;
using server.DTOs;
using server.Models;
using System.Linq.Dynamic.Core;

namespace server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PaperController : ControllerBase
    {
        private readonly PaperDbContext _context;

        public PaperController(PaperDbContext context)
        {
            _context = context;
        }

        // GET: api/Paper
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Paper>>> GetPapers(
            [FromQuery] string? search,
            [FromQuery] string? sortBy,
            [FromQuery] double? minPrice,
            [FromQuery] double? maxPrice,
            [FromQuery] bool? discontinued,
            [FromQuery] bool sortDescending = false)
        {
            var query = _context.Papers.AsQueryable();

            // Full-text search
            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(p => p.Name.Contains(search));
            }

            // Filtering
            if (minPrice.HasValue)
            {
                query = query.Where(p => p.Price >= minPrice.Value);
            }
            if (maxPrice.HasValue)
            {
                query = query.Where(p => p.Price <= maxPrice.Value);
            }
            if (discontinued.HasValue)
            {
                query = query.Where(p => p.Discontinued == discontinued.Value);
            }

            // Sorting
            if (!string.IsNullOrEmpty(sortBy))
            {
                var ordering = sortDescending ? $"{sortBy} descending" : sortBy;
                query = query.OrderBy(ordering);
            }

            var papers = await query
                .Include(p => p.Properties)
                .ToListAsync();

            return Ok(papers);
        }

        // GET: api/Paper/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Paper>> GetPaper(int id)
        {
            var paper = await _context.Papers
                                       .Include(p => p.Properties)
                                       .FirstOrDefaultAsync(p => p.Id == id);

            if (paper == null)
            {
                return NotFound("Paper not found.");
            }

            return paper;
        }

        // POST: api/Paper
        [HttpPost]
        public async Task<ActionResult<Paper>> PostPaper(PaperCreateDto paperDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var paper = new Paper
            {
                Name = paperDto.Name,
                Discontinued = paperDto.Discontinued,
                Stock = paperDto.Stock,
                Price = paperDto.Price
            };

            _context.Papers.Add(paper);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetPaper), new { id = paper.Id }, paper);
        }

        // PUT: api/Paper/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPaper(int id, PaperUpdateDto paperDto)
        {
            if (id != paperDto.Id)
            {
                return BadRequest("Paper ID mismatch.");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var paper = await _context.Papers.FindAsync(id);
            if (paper == null)
            {
                return NotFound("Paper not found.");
            }

            // Update fields
            paper.Name = paperDto.Name;
            paper.Discontinued = paperDto.Discontinued;
            paper.Stock = paperDto.Stock;
            paper.Price = paperDto.Price;

            _context.Entry(paper).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Papers.Any(e => e.Id == id))
                {
                    return NotFound("Paper not found.");
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/Paper/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePaper(int id)
        {
            var paper = await _context.Papers.FindAsync(id);
            if (paper == null)
            {
                return NotFound("Paper not found.");
            }

            _context.Papers.Remove(paper);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // PUT: api/Paper/5/Discontinue
        [HttpPut("{id}/Discontinue")]
        public async Task<IActionResult> DiscontinuePaper(int id)
        {
            var paper = await _context.Papers.FindAsync(id);
            if (paper == null)
            {
                return NotFound("Paper not found.");
            }

            paper.Discontinued = true;
            _context.Entry(paper).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // PUT: api/Paper/5/Restock
        [HttpPut("{id}/Restock")]
        public async Task<IActionResult> RestockPaper(int id, [FromBody] int quantity)
        {
            if (quantity <= 0)
            {
                return BadRequest("Quantity must be greater than zero.");
            }

            var paper = await _context.Papers.FindAsync(id);
            if (paper == null)
            {
                return NotFound("Paper not found.");
            }

            paper.Stock += quantity;
            _context.Entry(paper).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
