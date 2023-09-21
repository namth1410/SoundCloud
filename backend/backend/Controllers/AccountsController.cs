using backend.Data;
using backend.Models;
using backend.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountsController : ControllerBase
    {
        private readonly IAccountRepository accountRepo;
        private readonly SoundCloudContext context;

        public AccountsController(IAccountRepository repo, SoundCloudContext context)
        {
            accountRepo = repo;
            this.context = context;
        }

        [HttpPost("SignUp")]
        public async Task<IActionResult> SignUp(SignUpModel signUpModel)
        {
            Console.WriteLine(signUpModel);

            var result = await accountRepo.SignUpAsync(signUpModel);
            if (result.Succeeded)
            {
                return Ok(result.Succeeded);
            }
            foreach (var error in result.Errors)
            {
                Console.WriteLine("log ra nay");
                Console.WriteLine($"Error: {error.Code}, {error.Description}");
            }

            Console.WriteLine(result);
            Console.WriteLine("log ra nay");
            var errors = result.Errors.Select(error => new { Code = error.Code, Description = error.Description });
            return BadRequest(errors);

            // return Unauthorized(result);
        }

        [HttpPost("SignIn")]
        public async Task<IActionResult> SignIn(SignInModel signInModel)
        {
            var result = await accountRepo.SignInAsync(signInModel);

            if (string.IsNullOrEmpty(result))
            {
                return Unauthorized();
            }

            return Ok(result);
        }

        //[Authorize]
        [HttpGet("Get")]
        public async Task<IActionResult> getAll(string token)
        {
            var result = await context.Users.ToListAsync();

            return Ok(result);
        }
    }
}