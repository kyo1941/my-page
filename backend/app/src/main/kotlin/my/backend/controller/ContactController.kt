package my.backend.controller

import jakarta.validation.Valid
import my.backend.dto.ApiResponse
import my.backend.dto.ContactFormRequest
import my.backend.service.ContactService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import reactor.core.publisher.Mono

@RestController
@RequestMapping("/api")
class ContactController(private val contactService: ContactService) {

    @PostMapping("/contact")
    fun submitContactForm(
            @Valid @RequestBody request: ContactFormRequest
    ): Mono<ResponseEntity<ApiResponse>> {
        return contactService
                .processContactRequest(request)
                .thenReturn(ResponseEntity.ok(ApiResponse(message = "メール送信が完了しました")))
    }
}
