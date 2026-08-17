# Toolchain opcional de formatos

Estes comandos são referências para execução em máquina de desenvolvimento. Eles não foram executados nesta fase.

## Meshopt com gltfpack

```bash
gltfpack -i avatar.glb -o avatar-meshopt.glb -c -cc
```

Critérios: manter nomes de slots, nós do rig, 18 clips, duração dos clips, materiais e enquadramento visual.

## Draco com glTF-Transform

```bash
gltf-transform draco entrada.glb saida-draco.glb
```

Draco deve ser considerado principalmente para malhas estáticas maiores. Não será o padrão automático de avatares animados.

## KTX2 ETC1S

```bash
ktx create --format R8G8B8A8_SRGB --encode basis-lz --generate-mipmap entrada.png saida-etc1s.ktx2
```

## KTX2 UASTC

```bash
ktx create --format R8G8B8A8_SRGB --encode uastc --generate-mipmap entrada.png saida-uastc.ktx2
```

Depois da conversão: validar KTX2, testar KTX2Loader, medir memória, tempo de transcodificação e fidelidade em celular e desktop.
