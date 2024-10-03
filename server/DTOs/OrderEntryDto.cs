using System.ComponentModel.DataAnnotations;

namespace server.DTOs
{
    public class OrderEntryDto
    {
        [Required]
        public int ProductId { get; set; }

        [Range(1, int.MaxValue, ErrorMessage = "Quantity must be at least 1.")]
        public int Quantity { get; set; }
    }
}