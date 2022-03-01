import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrismComponent } from './prism/prism.component';

import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-csharp';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-rust';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-scss';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
  ],
  exports: []
})
export class SharedModule { }