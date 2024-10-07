using System.ComponentModel.DataAnnotations;

namespace server.DTOs
{
    public class OrderDTO
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Order date is required")]
        public DateTime OrderDate { get; set; }

        public DateOnly? DeliveryDate { get; set; }

        [Required(ErrorMessage = "Status is required")]
        [StringLength(50, ErrorMessage = "Status cannot be more than 50 characters")]
        public string Status { get; set; } = null!;

        [Range(0, double.MaxValue, ErrorMessage = "Total amount cannot be negative")]
        public double TotalAmount { get; set; }

        [Required(ErrorMessage = "Customer ID is required")]
        public int CustomerId { get; set; }

        // Include OrderEntries as simplified DTOs without navigation properties
        public ICollection<OrderEntryDTO>? OrderEntries { get; set; }
    }
}