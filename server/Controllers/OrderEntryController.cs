using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.DataAccess;
using server.Models;

namespace server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrderEntryController : ControllerBase
    {
        private readonly PaperDbContext _context;

        public OrderEntryController(PaperDbContext context)
        {
            _context = context;
        }

        // GET: api/OrderEntry
        [HttpGet]
        public async Task<ActionResult<IEnumerable<OrderEntry>>> GetOrderEntries()
        {
            return await _context.OrderEntries
                                 .Include(oe => oe.Product)
                                 .Include(oe => oe.Order)
                                 .ToListAsync();
        }

        // GET: api/OrderEntry/5
        [HttpGet("{id}")]
        public async Task<ActionResult<OrderEntry>> GetOrderEntry(int id)
        {
            var orderEntry = await _context.OrderEntries
                                           .Include(oe => oe.Product)
                                           .Include(oe => oe.Order)
                                           .FirstOrDefaultAsync(oe => oe.Id == id);

            if (orderEntry == null)
            {
                return NotFound("Order entry not found.");
            }

            return orderEntry;
        }

        // POST: api/OrderEntry
        [HttpPost]
        public async Task<ActionResult<OrderEntry>> PostOrderEntry(OrderEntry orderEntry)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.OrderEntries.Add(orderEntry);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetOrderEntry), new { id = orderEntry.Id }, orderEntry);
        }

        // PUT: api/OrderEntry/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutOrderEntry(int id, OrderEntry orderEntry)
        {
            if (id != orderEntry.Id)
            {
                return BadRequest("Order Entry ID mismatch.");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.Entry(orderEntry).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.OrderEntries.Any(e => e.Id == id))
                {
                    return NotFound("Order entry not found.");
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/OrderEntry/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrderEntry(int id)
        {
            var orderEntry = await _context.OrderEntries.FindAsync(id);
            if (orderEntry == null)
            {
                return NotFound("Order entry not found.");
            }

            _context.OrderEntries.Remove(orderEntry);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
