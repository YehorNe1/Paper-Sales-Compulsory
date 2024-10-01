using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.DataAccess;
using server.Models;

namespace server.Controllers;

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
    public async Task<ActionResult<IEnumerable<Paper>>> GetPapers()
    {
        return await _context.Papers.ToListAsync();
    }

    // GET: api/Paper/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Paper>> GetPaper(int id)
    {
        var paper = await _context.Papers.FindAsync(id);

        if (paper == null)
        {
            return NotFound();
        }

        return paper;
    }

    // POST: api/Paper
    [HttpPost]
    public async Task<ActionResult<Paper>> PostPaper(Paper paper)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        _context.Papers.Add(paper);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetPaper), new { id = paper.Id }, paper);
    }

    // PUT: api/Paper/5
    [HttpPut("{id}")]
    public async Task<IActionResult> PutPaper(int id, Paper paper)
    {
        if (id != paper.Id)
        {
            return BadRequest();
        }

        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        _context.Entry(paper).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!PaperExists(id))
            {
                return NotFound();
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
            return NotFound();
        }

        _context.Papers.Remove(paper);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool PaperExists(int id)
    {
        return _context.Papers.Any(e => e.Id == id);
    }
}