using System.ComponentModel.DataAnnotations.Schema;

namespace Domain
{
    [Table("Photos")]
    public class Photo
    {
        public string Id { get; set; }

        public string Url { get; set; }

        public bool IsMain { get; set; }

        
    }
}
