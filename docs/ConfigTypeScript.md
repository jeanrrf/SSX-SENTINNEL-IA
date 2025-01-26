## Configuração do TypeScript - `tsconfig.json`

### Visão Geral

Este documento descreve as opções de configuração do TypeScript utilizadas no arquivo `tsconfig.json` do projeto. A configuração foi otimizada para compatibilidade com o ECMAScript 2020+, para garantir uma compilação eficiente e para habilitar recursos como mapeamento de fontes e detecção rigorosa de tipos.

### Objetivo

A configuração do TypeScript foi ajustada para oferecer:

- **Compatibilidade com versões mais recentes do ECMAScript**, garantindo que os módulos modernos sejam usados e os recursos do TypeScript mais recentes sejam aproveitados.
- **Verificação rigorosa de tipos** para garantir que o código seja o mais seguro possível, especialmente em grandes projetos.
- **Compilação incremental** para melhorar a eficiência durante o desenvolvimento.
- **Suporte a fontes e módulos JSX**, necessário para projetos React.

### Estrutura do `tsconfig.json`

Abaixo estão as principais configurações do arquivo `tsconfig.json`:

```json
{
  "compilerOptions": {
    "incremental": true,
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.tsbuildinfo",
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2023", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": false,
    "moduleResolution": "node",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": false,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true,
    "sourceMap": true,
    "outDir": "./dist",
    "baseUrl": ".",
    "paths": {
      "@src/*": ["src/*"]
    },
    "resolveJsonModule": true
  },
  "include": [
    "src",
    "vite.config.ts",
    "**/*.{test,spec}.?(c|m)[jt]s?(x)"
  ],
  "exclude": [
    "**/node_modules/**",
    "**/dist/**",
    "**/cypress/**",
    "**/.{idea,git,cache,output,temp}/**",
    "**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build,eslint,prettier}.config.*"
  ]
}
```

### Explicação das Configurações

#### 1. **Opções do Compilador (`compilerOptions`)**

- **`incremental`**: Ativado para compilação incremental, o que melhora a eficiência ao compilar o projeto após mudanças parciais.
  
- **`tsBuildInfoFile`**: Caminho do arquivo que armazena as informações de compilação incremental.

- **`target`**: Especifica a versão do ECMAScript a ser usada. No caso, `ES2020` foi escolhido por sua compatibilidade com a maioria dos navegadores e ambientes de execução.

- **`useDefineForClassFields`**: Habilita a configuração que ajuda na forma como os campos de classe são definidos, utilizando o padrão ECMAScript.

- **`lib`**: Lista das bibliotecas incluídas no ambiente de compilação. Utilizamos `ES2023` para aproveitar os recursos mais recentes, além de `DOM` e `DOM.Iterable` para compatibilidade com navegação e iteração no DOM.

- **`module`**: Define o sistema de módulos. O valor `ESNext` habilita a sintaxe mais moderna de módulos.

- **`skipLibCheck`**: Configuração que desativa a verificação de tipos nas bibliotecas externas. Foi definida como `false` para garantir maior precisão na verificação de tipos.

- **`moduleResolution`**: Especifica o mecanismo para resolução de módulos. O valor `node` é a escolha mais compatível com projetos que utilizam Node.js.

- **`allowImportingTsExtensions`**: Permite importar arquivos TypeScript com extensões `.ts` diretamente em outros arquivos TypeScript.

- **`isolatedModules`**: Habilita a verificação para garantir que cada arquivo seja considerado como um módulo isolado.

- **`moduleDetection`**: Força o TypeScript a detectar módulos de maneira rigorosa, especialmente útil em grandes bases de código.

- **`noEmit`**: Impede a geração de arquivos de saída durante a compilação. Útil quando você apenas precisa da verificação de tipos e não da compilação do código em si.

- **`jsx`**: Define a configuração JSX. A opção `react-jsx` é utilizada para garantir compatibilidade com projetos React.

- **`strict`**: Habilita o modo estrito, que inclui várias verificações de tipos para garantir que o código seja o mais seguro possível.

- **`noUnusedLocals`**: Configurado como `false`, permitindo que variáveis locais não utilizadas sejam ignoradas durante o desenvolvimento.

- **`noUnusedParameters`**: Ativado para garantir que parâmetros de funções não utilizados sejam sinalizados.

- **`noFallthroughCasesInSwitch`**: Evita que o código entre nos casos de um `switch` sem um `break`, prevenindo erros lógicos.

- **`noUncheckedSideEffectImports`**: Desabilita a importação de módulos com efeitos colaterais não verificados.

- **`sourceMap`**: Gera arquivos de mapa de origem para facilitar o debug.

- **`outDir`**: Define o diretório onde os arquivos compilados serão armazenados.

- **`baseUrl`**: Define o diretório base para resolução de módulos.

- **`paths`**: Configuração personalizada para alias de módulos. Neste caso, o alias `@src/*` é mapeado para o diretório `src/*`.

- **`resolveJsonModule`**: Permite a importação de arquivos JSON diretamente no código TypeScript.

#### 2. **Inclusões e Exclusões**

- **`include`**: Define os diretórios e arquivos a serem incluídos na compilação. O diretório `src` e o arquivo `vite.config.ts` são incluídos, além de arquivos de testes.

- **`exclude`**: Define os diretórios e arquivos a serem excluídos da compilação, como `node_modules`, `dist`, e arquivos de configuração de ferramentas.

### Conclusão

Este arquivo `tsconfig.json` foi configurado para oferecer um bom equilíbrio entre compatibilidade, desempenho e verificação rigorosa de tipos. Ele é ideal para projetos modernos que utilizam TypeScript, especialmente para desenvolvedores que trabalham com React e projetos que utilizam módulos ESNext.

Para mais detalhes, consulte a [documentação oficial do TypeScript](https://www.typescriptlang.org/).
