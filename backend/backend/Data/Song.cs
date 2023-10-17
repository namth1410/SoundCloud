using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Data
{
    [Table("Song")]
    public class Song
    {
        [Required]
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public string? IdUser { get; set; }
        [Required]
        public string NameSong { get; set; }
        [Required]
        public string NameAuthor { get; set; }
        [Required]
        public string LinkSong { get; set; }
        public string? Lyric { get; set; }
        public string? Img { get; set; }

        [Required]
        [DefaultValue(0)]
        public int Views { get; set; }
        [Required]
        [DefaultValue(0)]
        public int Likes { get; set; }
    }
}