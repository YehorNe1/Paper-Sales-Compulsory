using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Controllers;
using server.DataAccess;
using server.Models;

namespace tests
{
    public class CustomerControllerTests : IDisposable
    {
        private readonly CustomerController _controller;
        private readonly PaperDbContext _context;

        public CustomerControllerTests()
        {
            // Initialize in-memory database with a unique name for isolation
            var options = new DbContextOptionsBuilder<PaperDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            _context = new PaperDbContext(options);

            // Seed test data
            _context.Customers.AddRange(
                new Customer
                {
                    Id = 1,
                    Name = "John Doe",
                    Address = "123 Main St",
                    Phone = "555-1234",
                    Email = "john@example.com"
                },
                new Customer
                {
                    Id = 2,
                    Name = "Jane Smith",
                    Address = "456 Elm St",
                    Phone = "555-5678",
                    Email = "jane@example.com"
                }
            );
            _context.SaveChanges();

            _controller = new CustomerController(_context);
        }

        public void Dispose()
        {
            // Clean up the in-memory database after each test
            _context.Database.EnsureDeleted();
            _context.Dispose();
        }

        [Fact]
        public async Task GetCustomers_ReturnsAllCustomers()
        {
            // Act
            var result = await _controller.GetCustomers();

            // Assert
            var actionResult = Assert.IsType<ActionResult<IEnumerable<Customer>>>(result);
            var returnValue = Assert.IsType<List<Customer>>(actionResult.Value);
            Assert.Equal(2, returnValue.Count);
        }

        [Fact]
        public async Task GetCustomer_ReturnsCustomer_WhenCustomerExists()
        {
            // Act
            var result = await _controller.GetCustomer(1);

            // Assert
            var actionResult = Assert.IsType<ActionResult<Customer>>(result);
            var returnValue = Assert.IsType<Customer>(actionResult.Value);
            Assert.Equal(1, returnValue.Id);
            Assert.Equal("John Doe", returnValue.Name);
        }

        [Fact]
        public async Task GetCustomer_ReturnsNotFound_WhenCustomerDoesNotExist()
        {
            // Act
            var result = await _controller.GetCustomer(99);

            // Assert
            var actionResult = Assert.IsType<ActionResult<Customer>>(result);
            Assert.IsType<NotFoundResult>(actionResult.Result);
        }

        [Fact]
        public async Task PostCustomer_AddsCustomer_WhenModelStateIsValid()
        {
            // Arrange
            var newCustomer = new Customer
            {
                Id = 3,
                Name = "Bob Johnson",
                Address = "789 Pine St",
                Phone = "555-9012",
                Email = "bob@example.com"
            };

            // Act
            var result = await _controller.PostCustomer(newCustomer);

            // Assert
            var actionResult = Assert.IsType<ActionResult<Customer>>(result);
            var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(actionResult.Result);
            var returnValue = Assert.IsType<Customer>(createdAtActionResult.Value);
            Assert.Equal(3, returnValue.Id);
            Assert.Equal(3, _context.Customers.Count());
        }

        [Fact]
        public async Task PostCustomer_ReturnsBadRequest_WhenModelStateIsInvalid()
        {
            // Arrange
            var newCustomer = new Customer
            {
                // Missing required Name property
                Address = "789 Pine St",
                Phone = "555-9012",
                Email = "invalid-email"
            };
            _controller.ModelState.AddModelError("Name", "Required");

            // Act
            var result = await _controller.PostCustomer(newCustomer);

            // Assert
            var actionResult = Assert.IsType<ActionResult<Customer>>(result);
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(actionResult.Result);
            Assert.IsType<SerializableError>(badRequestResult.Value);
        }

        [Fact]
        public async Task PutCustomer_UpdatesCustomer_WhenCustomerExists()
        {
            // Arrange
            var customerToUpdate = _context.Customers.First();
            customerToUpdate.Name = "Updated Name";

            // Act
            var result = await _controller.PutCustomer(customerToUpdate.Id, customerToUpdate);

            // Assert
            Assert.IsType<NoContentResult>(result);
            var updatedCustomer = _context.Customers.Find(customerToUpdate.Id);
            Assert.Equal("Updated Name", updatedCustomer.Name);
        }

        [Fact]
        public async Task PutCustomer_ReturnsBadRequest_WhenIdMismatch()
        {
            // Arrange
            var customerToUpdate = _context.Customers.First();
            var differentId = customerToUpdate.Id + 1;

            // Act
            var result = await _controller.PutCustomer(differentId, customerToUpdate);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestResult>(result);
        }

        [Fact]
        public async Task PutCustomer_ReturnsNotFound_WhenCustomerDoesNotExist()
        {
            // Arrange
            var nonExistentCustomer = new Customer
            {
                Id = 99,
                Name = "Non Existent",
                Address = "Nowhere",
                Phone = "000-0000",
                Email = "noone@example.com"
            };

            // Act
            var result = await _controller.PutCustomer(nonExistentCustomer.Id, nonExistentCustomer);

            // Assert
            var notFoundResult = Assert.IsType<NotFoundResult>(result);
        }

        [Fact]
        public async Task DeleteCustomer_DeletesCustomer_WhenCustomerExists()
        {
            // Act
            var result = await _controller.DeleteCustomer(1);

            // Assert
            Assert.IsType<NoContentResult>(result);
            Assert.Equal(1, _context.Customers.Count());
            Assert.Null(_context.Customers.Find(1));
        }

        [Fact]
        public async Task DeleteCustomer_ReturnsNotFound_WhenCustomerDoesNotExist()
        {
            // Act
            var result = await _controller.DeleteCustomer(99);

            // Assert
            var notFoundResult = Assert.IsType<NotFoundResult>(result);
        }
    }
}
