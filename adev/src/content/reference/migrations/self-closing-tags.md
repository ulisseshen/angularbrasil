<!-- ia-translate: true -->
# Migration para self-closing tags

Self-closing tags são suportadas em templates Angular desde a [v16](https://blog.angular.dev/angular-v16-is-here-4d7a28ec680d#7065).

Este schematic migra os templates em sua aplicação para usar self-closing tags.

Execute o schematic usando o seguinte comando:

<docs-code language="shell">

ng generate @angular/core:self-closing-tag

</docs-code>

#### Antes

<docs-code language="angular-html">

<hello-world></hello-world>

</docs-code>

#### Depois

<docs-code language="angular-html">

<hello-world />

</docs-code>
