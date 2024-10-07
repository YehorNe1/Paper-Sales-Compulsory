using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace server.Models
{
    public partial class OrderEntry
    {
        public int Id { get; set; }

        [Range(1, int.MaxValue, ErrorMessage = "Quantity must be at least 1")]
        public int Quantity { get; set; }

        [Required(ErrorMessage = "Please enter the product ID")]
        public int ProductId { get; set; }

        [Required(ErrorMessage = "Please enter the order ID")]
        public int OrderId { get; set; }

        [JsonIgnore]
        public virtual Order Order { get; set; } = null!;
        public virtual Paper Product { get; set; } = null!;
    }
}