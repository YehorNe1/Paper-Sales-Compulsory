using System.ComponentModel.DataAnnotations;

namespace server.Models
{
    public partial class Order
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

        public virtual Customer Customer { get; set; } = null!;

        public virtual ICollection<OrderEntry> OrderEntries { get; set; } = new List<OrderEntry>();
    }
}