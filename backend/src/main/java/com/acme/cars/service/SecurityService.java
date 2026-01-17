package com.acme.cars.service;

import com.acme.cars.dto.AuthUserDTO;
import com.acme.cars.exception.AuthenticationException;
import com.acme.cars.model.Usuario;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SecurityService {
    private final UsuarioService usuarioService;
    private final TokenService tokenService;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    
    public String authenticate(AuthUserDTO authUserDTO) throws AuthenticationException {
        Optional<Usuario> byEmail = usuarioService.findByEmail(authUserDTO.email());
        if(byEmail.isEmpty()) throw new AuthenticationException("Usuario ou senha incorretos");
        Usuario usuario = byEmail.get();
        if(passwordEncoder.matches(authUserDTO.password(), usuario.getPassword())) {
            return tokenService.generateToken(usuario);
        } else {
            throw new AuthenticationException("Usuario ou senha incorretos");
        }
    }
}
