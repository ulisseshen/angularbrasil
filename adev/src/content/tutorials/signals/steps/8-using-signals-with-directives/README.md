<!-- ia-translate: true -->
# Usando signals com directives

Agora que você aprendeu a [usar signals com services](/tutorials/signals/7-using-signals-with-services), vamos explorar como directives usam signals. **A boa notícia: signals funcionam exatamente da mesma forma em directives como funcionam em components!** A principal diferença é que, como directives não têm templates, você usará principalmente signals em host bindings para atualizar reativamente o elemento host.

Nesta atividade, você construirá um directive de destaque que demonstra como signals criam comportamento reativo em directives.

<hr />

<docs-workflow>

<docs-step title="Configure signals exatamente como em um component">
Importe as funções signal e crie seu estado reativo. Isso funciona exatamente da mesma forma que em components:

```ts
import {Directive, input, signal, computed} from '@angular/core';

@Directive({
  selector: '[highlight]',
})
export class HighlightDirective {
  // Signal inputs - igual aos components!
  color = input<string>('yellow');
  intensity = input<number>(0.3);

  // Internal state - igual aos components!
  private isHovered = signal(false);

  // Computed signals - igual aos components!
  backgroundStyle = computed(() => {
    const baseColor = this.color();
    const alpha = this.isHovered() ? this.intensity() : this.intensity() * 0.5;

    const colorMap: Record<string, string> = {
      'yellow': `rgba(255, 255, 0, ${alpha})`,
      'blue': `rgba(0, 100, 255, ${alpha})`,
      'green': `rgba(0, 200, 0, ${alpha})`,
      'red': `rgba(255, 0, 0, ${alpha})`,
    };

    return colorMap[baseColor] || colorMap['yellow'];
  });
}
```

Observe como isso é idêntico aos padrões de component - a única diferença é que estamos em um `@Directive` em vez de `@Component`.
</docs-step>

<docs-step title="Use signals em host bindings">
Como directives não têm templates, você usará signals em **host bindings** para atualizar reativamente o elemento host. Adicione a configuração `host` e os manipuladores de eventos:

```ts
@Directive({
  selector: '[highlight]',
  host: {
    '[style.backgroundColor]': 'backgroundStyle()',
    '(mouseenter)': 'onMouseEnter()',
    '(mouseleave)': 'onMouseLeave()',
  },
})
export class HighlightDirective {
  // ... signals do passo anterior ...

  onMouseEnter() {
    this.isHovered.set(true);
  }

  onMouseLeave() {
    this.isHovered.set(false);
  }
}
```

Os host bindings são automaticamente reavaliados quando os signals mudam - assim como template bindings em components! Quando `isHovered` muda, o computed signal `backgroundStyle` recalcula, e o host binding atualiza o estilo do elemento.
</docs-step>

<docs-step title="Use o directive no seu template">
Atualize o template do app para demonstrar o directive reativo:

```angular-ts
template: `
  <div>
    <h1>Directive with Signals</h1>

    <div highlight color="yellow" [intensity]="0.2">
      Hover me - Yellow highlight
    </div>

    <div highlight color="blue" [intensity]="0.4">
      Hover me - Blue highlight
    </div>

    <div highlight color="green" [intensity]="0.6">
      Hover me - Green highlight
    </div>
  </div>
`,
```

O directive aplica automaticamente destaque reativo com base nos signal inputs!
</docs-step>

</docs-workflow>

Perfeito! Você agora viu como signals funcionam com directives. Alguns pontos-chave desta lição são:

- **Signals são universais** - Todas as APIs signal (`input()`, `signal()`, `computed()`, `effect()`) funcionam da mesma forma tanto em directives quanto em components
- **Host bindings são o caso de uso principal** - Como directives não têm templates, você usa signals em host bindings para modificar reativamente o elemento host
- **Mesmos padrões reativos** - Atualizações de signal acionam a reavaliação automática de computed signals e host bindings, assim como em templates de component

Na próxima lição, você [aprenderá como consultar elementos filhos com signal queries](/tutorials/signals/9-query-child-elements-with-signal-queries)!
