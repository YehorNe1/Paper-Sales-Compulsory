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
    public class ProductsController : ControllerBase
    {
        private readonly PaperDbContext _context;
        private readonly IMapper _mapper;

        public ProductsController(PaperDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET: api/Products
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PaperDTO>>> GetProducts(
            string? search, string? sortBy, bool? ascending, int? propertyId)
        {
            var query = _context.Papers.AsQueryable();

            // Exclude discontinued products
            query = query.Where(p => !p.Discontinued);

            // Full-text search
            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(p => p.Name.Contains(search));
            }

            // Filtering by property
            if (propertyId.HasValue)
            {
                query = query.Where(p => p.Properties.Any(prop => prop.Id == propertyId.Value));
            }

            // Sorting
            if (!string.IsNullOrEmpty(sortBy))
            {
                switch (sortBy.ToLower())
                {
                    case "name":
                        query = ascending.GetValueOrDefault(true) ? query.OrderBy(p => p.Name) : query.OrderByDescending(p => p.Name);
                        break;
                    case "price":
                        query = ascending.GetValueOrDefault(true) ? query.OrderBy(p => p.Price) : query.OrderByDescending(p => p.Price);
                        break;
                    case "stock":
                        query = ascending.GetValueOrDefault(true) ? query.OrderBy(p => p.Stock) : query.OrderByDescending(p => p.Stock);
                        break;
                    default:
                        break;
                }
            }

            var products = await query.Include(p => p.Properties).ToListAsync();
            var productDtos = _mapper.Map<List<PaperDTO>>(products);

            return Ok(productDtos);
        }
    }
}