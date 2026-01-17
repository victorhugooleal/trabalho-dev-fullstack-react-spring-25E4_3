package com.acme.cars.service;

import com.acme.cars.model.Carro;
import com.opencsv.CSVWriter;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.FileWriter;
import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CsvService {
    private final CarroService carroService;
    public void generate(String filepath){
        List<Carro> all = carroService.listarTodos();
        try(CSVWriter writer=  new CSVWriter(new FileWriter(filepath))){
            writer.writeNext(new String[]{"ID", "MODELO", "ANO","COR","HP","FABRICANTE","PAIS"});
            for(Carro carro : all){
                writer.writeNext(new String[]{
                        String.valueOf(carro.getId()),
                        carro.getModelo(),
                        String.valueOf(carro.getAno()),
                        carro.getCor(),
                        String.valueOf(carro.getCavalosDePotencia()),
                        carro.getFabricante(),
                        carro.getPais()
                });
            }
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
