# Instruções para Manutenção do Site SENTINNELL WORKSTATION

## 👥 Usuários do Sistema

### Administrador

- Username: `jean`
- Senha: `31676685`
- Acesso total ao sistema

### Usuários Convidados

1. **Paulo**
   - Username: `paulo`
   - Senha: `convidado@auth1`
   - Limite de armazenamento: 50MB

2. **Dercilei**
   - Username: `dercilei`
   - Senha: `convidado@auth2`
   - Limite de armazenamento: 50MB

## 🌐 Links Importantes

- Site publicado: <https://jeanrrf.github.io/SSX-SENTINNEL-IA/>
- Repositório GitHub: <https://github.com/jeanrrf/SSX-SENTINNEL-IA>

## 💻 Arquivos Locais

Os arquivos do site estão em:
`c:/Users/Jean Rosso/CascadeProjects/temp-website`

## 📝 Como Fazer Alterações

### 1. Antes de começar a trabalhar

Sempre pegue a versão mais recente do código:

```bash
git pull
```

### 2. Depois de fazer alterações

Para enviar suas mudanças para o site:

```bash
git add .
git commit -m "Descreva o que você mudou"
git push
```

### 3. Aguarde a atualização

- Depois do push, aguarde alguns minutos
- O GitHub vai atualizar o site automaticamente
- Você pode acompanhar o processo em: <https://github.com/jeanrrf/SSX-SENTINNEL-IA/actions>

## 🔧 Desenvolvimento Local

### Para rodar o site localmente

```bash
npm run dev
```

- O site ficará disponível em: <http://localhost:5173>

### Para criar versão de produção

```bash
npm run build
npm run preview
```

- A versão de produção ficará em: <http://localhost:4173>

## ⚠️ Dicas Importantes

1. Sempre mantenha uma cópia de backup dos arquivos
2. Faça alterações pequenas e frequentes
3. Use mensagens claras nos commits
4. Teste localmente antes de publicar

## 🆘 Problemas Comuns

### Se der erro no git pull

```bash
git stash
git pull
git stash pop
```

### Se der erro no git push

```bash
git pull
# Resolva conflitos se houver
git push
```

## 📱 Contatos Úteis

- Suporte GitHub: <https://support.github.com>
- Documentação Vite: <https://vitejs.dev>
- Documentação React: <https://react.dev>
