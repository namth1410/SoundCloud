using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Data
{
    [Table("History")]
    public class History
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        [Required]
        public string IdUser { get; set; }
        [Required]
        public int IdSong { get; set; }

        [ForeignKey("IdUser")]
        public Account User { get; set; }

        [ForeignKey("IdSong")]
        public Song Song { get; set; }

        [Required]
        public DateTime CreatedAt { get; set; }
    }
}