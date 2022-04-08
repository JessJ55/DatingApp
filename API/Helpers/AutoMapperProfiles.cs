using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Extensions;
using AutoMapper;

namespace API.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        { //esto es para mapear los dto con las clases
            CreateMap<AppUser,MemberDto>()
            .ForMember(dest => dest.PhotoUrl,opt => opt.MapFrom(src =>
             src.Photos.FirstOrDefault(x=> x.IsMain).Url))
            .ForMember(dest => dest.Age, opt => opt.MapFrom
            (src => src.DateofBirth.CalculateAge()));//esto sigue un orden
            //1 destino 2 desde donde mapeamos 3 la fuente desde donde mapeamos
            CreateMap<Photo,PhotoDto>();
            CreateMap<MemberUpdateDto,AppUser>();
            CreateMap<RegisterDto,AppUser>();
            CreateMap<Message,MessageDto>().ForMember(dest=> dest.SenderPhotoUrl, 
            opt => opt.MapFrom(src => src.Sender.Photos.FirstOrDefault(x => x.IsMain).Url))
            .ForMember(dest=> dest.RecipientPhotoUrl, 
            opt => opt.MapFrom(src => src.Recipient.Photos.FirstOrDefault(x => x.IsMain).Url));
            CreateMap<MessageDto, Message>();//un cambio para saber si se solu el error del message
            //CreateMap<DateTime, DateTime>().ConvertUsing(d => DateTime.SpecifyKind(d,DateTimeKind.Utc));
        }
    }
}