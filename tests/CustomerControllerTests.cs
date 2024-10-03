using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Controllers;
using server.DataAccess;
using server.Models;
using Xunit;

namespace tests
{
    public class CustomerControllerTests : IDisposable
    {
        private readonly PaperDbContext _context;
        private readonly CustomerController _controller;

        public CustomerControllerTests()
        {
            // Configure in-memory database
            var options = new DbContextOptionsBuilder<PaperDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString()) // Unique DB for each test
                .Options;

            _context = new PaperDbContext(options);

            // Seed the database with test data
            SeedDatabase();

            _controller = new CustomerController(_context);
        }

        private void SeedDatabase()
        {
            var customers = new List<Customer>
            {
                new Customer { Id = 1, Name = "Alice Smith", Address = "123 Maple Street", Phone = "123-456-7890", Email = "alice@example.com" },
                new Customer { Id = 2, Name = "Bob Johnson", Address = "456 Oak Avenue", Phone = "987-654-3210", Email = "bob@example.com" }
            };

            _context.Customers.AddRange(customers);
            _context.SaveChanges();
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
        public async Task GetCustomer_ExistingId_ReturnsCustomer()
        {
            // Arrange
            int testId = 1;

            // Act
            var result = await _controller.GetCustomer(testId);

            // Assert
            var actionResult = Assert.IsType<ActionResult<Customer>>(result);
            var returnValue = Assert.IsType<Customer>(actionResult.Value);
            Assert.Equal("Alice Smith", returnValue.Name);
        }

        [Fact]
        public async Task GetCustomer_NonExistingId_ReturnsNotFound()
        {
            // Arrange
            int testId = 999;

            // Act
            var result = await _controller.GetCustomer(testId);

            // Assert
            var actionResult = Assert.IsType<ActionResult<Customer>>(result);
            Assert.IsType<NotFoundResult>(actionResult.Result);
        }

        [Fact]
        public async Task PostCustomer_Valid_ReturnsCreatedCustomer()
        {
            // Arrange
            var newCustomer = new Customer
            {
                Name = "Charlie Davis",
                Address = "789 Pine Road",
                Phone = "555-555-5555",
                Email = "charlie@example.com"
            };

            // Act
            var result = await _controller.PostCustomer(newCustomer);

            // Assert
            var actionResult = Assert.IsType<ActionResult<Customer>>(result);
            var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(actionResult.Result);
            var returnValue = Assert.IsType<Customer>(createdAtActionResult.Value);
            Assert.Equal("Charlie Davis", returnValue.Name);
            Assert.Equal(3, _context.Customers.Count());
        }

        [Fact]
        public async Task PostCustomer_Invalid_ReturnsBadRequest()
        {
            // Arrange
            var invalidCustomer = new Customer
            {
                // Missing required Name property
                Address = "789 Pine Road",
                Phone = "555-555-5555",
                Email = "invalid-email-format" // Invalid email
            };

            _controller.ModelState.AddModelError("Name", "The Name field is required.");
            _controller.ModelState.AddModelError("Email", "Invalid email address format");

            // Act
            var result = await _controller.PostCustomer(invalidCustomer);

            // Assert
            var actionResult = Assert.IsType<ActionResult<Customer>>(result);
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(actionResult.Result);
            Assert.IsType<SerializableError>(badRequestResult.Value);
            Assert.Equal(2, _context.Customers.Count());
        }

        [Fact]
        public async Task PutCustomer_Valid_ReturnsNoContent()
        {
            // Arrange
            int testId = 1;
            var existingCustomer = await _context.Customers.FindAsync(testId);
            Assert.NotNull(existingCustomer); // Ensure the customer exists

            // Update properties
            existingCustomer.Name = "Alice Smith Updated";
            existingCustomer.Email = "alice.updated@example.com";

            // Act
            var result = await _controller.PutCustomer(testId, existingCustomer);

            // Assert
            Assert.IsType<NoContentResult>(result);
            var customer = await _context.Customers.FindAsync(testId);
            Assert.Equal("Alice Smith Updated", customer.Name);
            Assert.Equal("alice.updated@example.com", customer.Email);
        }


        [Fact]
        public async Task PutCustomer_IdMismatch_ReturnsBadRequest()
        {
            // Arrange
            int testId = 1;
            var updatedCustomer = new Customer
            {
                Id = 2, // Mismatched ID
                Name = "Alice Smith Updated",
                Address = "123 Maple Street",
                Phone = "123-456-7890",
                Email = "alice.updated@example.com"
            };

            // Act
            var result = await _controller.PutCustomer(testId, updatedCustomer);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("Customer ID mismatch.", badRequestResult.Value);
        }

        [Fact]
        public async Task PutCustomer_NonExisting_ReturnsNotFound()
        {
            // Arrange
            int testId = 999;
            var updatedCustomer = new Customer
            {
                Id = testId,
                Name = "Non-Existent Customer",
                Address = "No Address",
                Phone = "000-000-0000",
                Email = "nonexistent@example.com"
            };

            // Act
            var result = await _controller.PutCustomer(testId, updatedCustomer);

            // Assert
            var notFoundResult = Assert.IsType<NotFoundObjectResult>(result);
            Assert.Equal("Customer not found.", notFoundResult.Value);
        }

        [Fact]
        public async Task DeleteCustomer_Existing_ReturnsNoContent()
        {
            // Arrange
            int testId = 1;

            // Act
            var result = await _controller.DeleteCustomer(testId);

            // Assert
            Assert.IsType<NoContentResult>(result);
            Assert.Null(await _context.Customers.FindAsync(testId));
            Assert.Single(_context.Customers);
        }

        [Fact]
        public async Task DeleteCustomer_NonExisting_ReturnsNotFound()
        {
            // Arrange
            int testId = 999;

            // Act
            var result = await _controller.DeleteCustomer(testId);

            // Assert
            var notFoundResult = Assert.IsType<NotFoundObjectResult>(result);
            Assert.Equal("Customer not found.", notFoundResult.Value);
            Assert.Equal(2, _context.Customers.Count());
        }

        [Fact]
        public async Task GetCustomerOrders_ExistingCustomer_ReturnsOrders()
        {
            // Arrange
            int testCustomerId = 1;

            // Act
            var result = await _controller.GetCustomerOrders(testCustomerId);

            // Assert
            var actionResult = Assert.IsType<ActionResult<IEnumerable<Order>>>(result);
            var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
            var returnValue = Assert.IsAssignableFrom<IEnumerable<Order>>(okResult.Value);
            Assert.Equal(2, returnValue.Count());

            // Further assert that related entities are included
            foreach (var order in returnValue)
            {
                Assert.NotNull(order.OrderEntries);
                Assert.All(order.OrderEntries, oe => Assert.NotNull(oe.Product));
            }
        }


        [Fact]
        public async Task GetCustomerOrders_NonExistingCustomer_ReturnsNotFound()
        {
            // Arrange
            int testCustomerId = 999;

            // Act
            var result = await _controller.GetCustomerOrders(testCustomerId);

            // Assert
            var actionResult = Assert.IsType<ActionResult<IEnumerable<Order>>>(result);
            var notFoundResult = Assert.IsType<NotFoundObjectResult>(actionResult.Result);
            Assert.Equal("Customer not found.", notFoundResult.Value);
        }

        public void Dispose()
        {
            _context.Dispose();
        }
    }
}