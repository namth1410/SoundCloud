using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    public class SongLikeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
