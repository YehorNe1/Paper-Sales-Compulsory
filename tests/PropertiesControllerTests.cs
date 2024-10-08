using Microsoft.EntityFrameworkCore;
using AutoMapper;
using server.Controllers;
using server.DataAccess;
using server.DTOs;
using server.Models;
using Microsoft.AspNetCore.Mvc;

namespace server.Tests.Controllers
{
    public class PropertiesControllerTests
    {
        private readonly IMapper _mapper;
        private readonly DbContextOptions<PaperDbContext> _dbContextOptions;

        public PropertiesControllerTests()
        {
            var config = new MapperConfiguration(cfg =>
            {
                cfg.CreateMap<Property, PropertyDTO>().ReverseMap();
            });
            _mapper = config.CreateMapper();
            
            _dbContextOptions = new DbContextOptionsBuilder<PaperDbContext>()
                .UseInMemoryDatabase(databaseName: "TestPaperDb")
                .Options;
            
            using (var context = new PaperDbContext(_dbContextOptions))
            {
                if (!context.Properties.Any())
                {
                    context.Properties.AddRange(
                        new Property { Id = 1, PropertyName = "Color" },
                        new Property { Id = 2, PropertyName = "Size" }
                    );

                    context.Papers.AddRange(
                        new Paper { Id = 10, Name = "Paper A", Discontinued = false, Stock = 100, Price = 9.99 },
                        new Paper { Id = 20, Name = "Paper B", Discontinued = false, Stock = 200, Price = 19.99 }
                    );

                    context.SaveChanges();
                }
            }
        }

        private PaperDbContext GetContext()
        {
            return new PaperDbContext(_dbContextOptions);
        }

        [Fact]
        public async Task CreateProperty_ReturnsCreatedProperty()
        {
            // Arrange
            using var context = GetContext();
            var controller = new PropertiesController(context, _mapper);
            var newPropertyDto = new PropertyDTO
            {
                PropertyName = "Weight"
            };

            // Act
            var result = await controller.CreateProperty(newPropertyDto);

            // Assert
            var actionResult = Assert.IsType<ActionResult<PropertyDTO>>(result);
            var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(actionResult.Result);
            var returnValue = Assert.IsType<PropertyDTO>(createdAtActionResult.Value);
            Assert.Equal(newPropertyDto.PropertyName, returnValue.PropertyName);
            Assert.True(returnValue.Id > 0);
        }

        [Fact]
        public async Task AddPropertyToProduct_ReturnsNoContent()
        {
            // Arrange
            using var context = GetContext();
            var controller = new PropertiesController(context, _mapper);
            int propertyId = 1; // Assuming property with Id 1 exists
            int productId = 10; // Assuming product with Id 10 exists

            // Act
            var result = await controller.AddPropertyToProduct(propertyId, productId);

            // Assert
            Assert.IsType<NoContentResult>(result);

            // Verify that the property was added to the product
            var product = await context.Papers
                .Include(p => p.Properties)
                .FirstOrDefaultAsync(p => p.Id == productId);

            Assert.NotNull(product);
            Assert.Contains(product.Properties, p => p.Id == propertyId);
        }

        [Fact]
        public async Task AddPropertyToProduct_ReturnsNotFound_WhenPropertyDoesNotExist()
        {
            // Arrange
            using var context = GetContext();
            var controller = new PropertiesController(context, _mapper);
            int propertyId = 999; // Non-existent property
            int productId = 10; // Assuming product with Id 10 exists

            // Act
            var result = await controller.AddPropertyToProduct(propertyId, productId);

            // Assert
            Assert.IsType<NotFoundResult>(result);
        }

        [Fact]
        public async Task GetPropertyById_ReturnsProperty()
        {
            // Arrange
            using var context = GetContext();
            var controller = new PropertiesController(context, _mapper);
            int propertyId = 1; // Assuming property with Id 1 exists

            // Act
            var result = await controller.GetPropertyById(propertyId);

            // Assert
            var actionResult = Assert.IsType<ActionResult<PropertyDTO>>(result);
            var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
            var propertyDto = Assert.IsType<PropertyDTO>(okResult.Value);
            Assert.Equal(propertyId, propertyDto.Id);
            Assert.Equal("Color", propertyDto.PropertyName);
        }

        [Fact]
        public async Task GetPropertyById_ReturnsNotFound()
        {
            // Arrange
            using var context = GetContext();
            var controller = new PropertiesController(context, _mapper);
            int propertyId = 999; // Non-existent property

            // Act
            var result = await controller.GetPropertyById(propertyId);

            // Assert
            Assert.IsType<NotFoundResult>(result.Result);
        }

        [Fact]
        public async Task GetAllProperties_ReturnsAllProperties()
        {
            // Arrange
            using var context = GetContext();
            var controller = new PropertiesController(context, _mapper);

            // Act
            var result = await controller.GetAllProperties();

            // Assert
            var actionResult = Assert.IsType<ActionResult<IEnumerable<PropertyDTO>>>(result);
            var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
            var properties = Assert.IsAssignableFrom<IEnumerable<PropertyDTO>>(okResult.Value);
            Assert.Equal(2, properties.Count());
        }
    }
}