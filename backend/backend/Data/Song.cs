using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Data
{
    [Table("Song")]
    public class Song
    {
        [Required]
        [Key]
        public int Id { get; set; }
        [Required]
        public string NameSong { get; set; }
        [Required]
        public string NameAuthor { get; set; }
        [Required]
        public string LinkSong { get; set; }
        public string? Lyric { get; set; }
        public string? Img { get; set; }
    }
}