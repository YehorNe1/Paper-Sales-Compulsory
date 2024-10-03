using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace server.DTOs
{
    public class OrderPlacementDto
    {
        [Required]
        public int CustomerId { get; set; }

        [Required]
        public DateTime OrderDate { get; set; }

        public DateOnly? DeliveryDate { get; set; }

        [Required]
        [StringLength(50)]
        public string Status { get; set; } = "Processing"; // Default status

        [Required]
        [MinLength(1, ErrorMessage = "At least one order entry is required.")]
        public List<OrderEntryDto> OrderEntries { get; set; } = new List<OrderEntryDto>();
    }
}