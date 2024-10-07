using AutoMapper;
using server.DTOs;
using server.Models;

namespace server.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // Customer Mapping
            CreateMap<Customer, CustomerDTO>().ReverseMap();

            // Order Mapping
            CreateMap<Order, OrderDTO>()
                .ForMember(dest => dest.OrderEntries, opt => opt.MapFrom(src => src.OrderEntries))
                .ReverseMap();

            // OrderEntry Mapping
            CreateMap<OrderEntry, OrderEntryDTO>()
                .ForMember(dest => dest.Product, opt => opt.MapFrom(src => src.Product))
                .ReverseMap();

            // Paper Mapping
            CreateMap<Paper, PaperDTO>()
                .ForMember(dest => dest.Properties, opt => opt.MapFrom(src => src.Properties))
                .ReverseMap();

            // Property Mapping
            CreateMap<Property, PropertyDTO>().ReverseMap();
        }
    }
}