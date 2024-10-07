using System.ComponentModel.DataAnnotations;

namespace server.DTOs
{
    public class PaperDTO
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Paper title is required")]
        [StringLength(255, ErrorMessage = "Paper title cannot be more than 255 characters")]
        public string Name { get; set; } = null!;

        public bool Discontinued { get; set; }

        [Range(0, int.MaxValue, ErrorMessage = "Stock cannot be negative")]
        public int Stock { get; set; }

        [Range(0.01, double.MaxValue, ErrorMessage = "Price must be greater than zero")]
        public double Price { get; set; }

        // Include Properties if necessary
        public ICollection<PropertyDTO>? Properties { get; set; }
    }
}