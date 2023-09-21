using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Data
{
    [Table("SongLike")]
    public class SongLike
    {
        [Required]
        [Key]
        public int Id { get; set; }
        [Required]
        public int IdUser { get; set; }
        [Required]
        public int IdSong { get; set; }
    }
}