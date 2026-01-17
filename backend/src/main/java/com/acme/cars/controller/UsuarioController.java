package com.acme.cars.controller;

import com.acme.cars.dto.AuthUserDTO;
import com.acme.cars.exception.AuthenticationException;
import com.acme.cars.model.Usuario;
import com.acme.cars.payload.AuthPayload;
import com.acme.cars.service.SecurityService;
import com.acme.cars.service.TokenService;
import com.acme.cars.service.UsuarioService;
import com.auth0.jwt.exceptions.SignatureVerificationException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
public class UsuarioController {
    private final UsuarioService usuarioService;
    private final SecurityService securityService;
    private final TokenService tokenService;
    @GetMapping
    public ResponseEntity<List<Usuario>> getAllUsuario() {
        return ResponseEntity.ok(usuarioService.findAll());
    }
    @PostMapping("/login")
    public ResponseEntity<?> autenticate(@RequestBody AuthUserDTO authUserDTO){
        try{
            String authenticate = securityService.authenticate(authUserDTO);
            return ResponseEntity.ok(new AuthPayload(authenticate));
        }catch (AuthenticationException ex){
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("message", "Usuario ou senha invalidos"));
        }
    }
    @GetMapping("/my-profile")
    public ResponseEntity<?> getMyProfile(
            @RequestHeader(value = "authorization", required = true) String token) {
        try{
            String usuario = tokenService.getUsuario(tokenService.isValid(token));
            Optional<Usuario> byId = usuarioService.findById(Long.valueOf(usuario));
            return byId.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
        }catch (SignatureVerificationException ex){
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "Not Autorized"));
        }

    }
}
