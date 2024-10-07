using System.ComponentModel.DataAnnotations;

namespace server.DTOs
{
    public class OrderEntryDTO
    {
        public int Id { get; set; }

        [Range(1, int.MaxValue, ErrorMessage = "Quantity must be at least 1")]
        public int Quantity { get; set; }

        [Required(ErrorMessage = "Please enter the product ID")]
        public int ProductId { get; set; }

        [Required(ErrorMessage = "Please enter the order ID")]
        public int OrderId { get; set; }

        // Include Product as a simplified DTO if necessary
        public PaperDTO? Product { get; set; }
    }
}
