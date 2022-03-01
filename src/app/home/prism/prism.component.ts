import {Component, Input, OnChanges} from '@angular/core';

@Component({
  selector: 'app-prism',
  templateUrl: './prism.component.html',
  styleUrls: ['./prism.component.scss']
})
export class PrismComponent implements OnChanges {
  @Input() code?: string;
  @Input() language?: string;
  @Input() needsHighlight?: boolean;

  highlightedCode: string;

  strReg1 = /"(.*?)"/g;
  strReg2 = /'(.*?)'/g;
  keyword = /\b(^class|def|print|return|from|import|new|var|if|do|function|while|this|switch|for|foreach|of|in|continue|break)(?=[^\w])/g;
  datatype = /\b(int|list|dict|string|void|float|any|double|set|number)(?=[^\w])/g;
  declaration = /\b(let|const|var|static|final)(?=[^\w])/g;
  number = /\b([0-9]+)/g;
  braces = /({|})/g;
  bracket = /(\(|\))/g;
  square = /(\[|\])/g;

  // specialJsGlobReg = /\b(document|window|Array|String|Object|Number|\$)(?=[^\w])/g;
  // specialJsReg = /\b(getElementsBy(TagName|ClassName|Name)|getElementById|typeof|instanceof)(?=[^\w])/g;
  // specialMethReg = /\b(indexOf|match|replace|toString|length)(?=[^\w])/g;
  // specialPhpReg = /\b(define|echo|print_r|var_dump)(?=[^\w])/g;
  // specialCommentReg = /(\/\*.*\*\/)/g;
  // inlineCommentReg = /(\/\/.*)/g;

  // htmlTagReg = /(&lt;[^\&]*&gt;)/g;

  constructor() { }

  // ngOnInit() {
  //   this.highlightedCode = `${this.code}`;
  //   this.highlightedCode = `<span class="foreground">${this.code}</span>`;
  // }

  ngOnChanges(changes: any): void {
    this.highlightedCode = this.code.replace(this.strReg1,'<span class="string">"$1"</span>');
    this.highlightedCode = this.highlightedCode.replace(this.strReg2,'<span class="code_string">"$1"</span>');
    this.highlightedCode = this.highlightedCode.replace(this.keyword,'<span class="code_keyword">$1</span>');
    this.highlightedCode = this.highlightedCode.replace(this.datatype,'<span class="code_datatype">$1</span>');
    this.highlightedCode = this.highlightedCode.replace(this.declaration,'<span class="code_declaration">$1</span>');
    this.highlightedCode = this.highlightedCode.replace(this.braces,'<span class="code_braces">$1</span>');
    this.highlightedCode = this.highlightedCode.replace(this.bracket,'<span class="code_bracket">$1</span>');
    // this.highlightedCode = this.highlightedCode.replace(this.square,'<span class="code_square">$1</span>');
    this.highlightedCode = this.highlightedCode.replace(this.number,'<span class="code_number">$1</span>');
    // this.highlightedCode = this.highlightedCode.replace(this.commonbracket,'<span class="code_commonbracket">$1</span>');

  }

  // ngAfterViewInit() {
  //   console.log('Inside of Prism ngAfterViewInit!');
  //   Prism.highlightElement(this.codeEle.nativeElement);
  // }

  // ngOnChanges(changes: any): void {
  //   console.log('Inside of Prism ngOnChanges!');
  //   if (changes?.code) {
  //     if (this.codeEle?.nativeElement) {
  //       this.codeEle.nativeElement.textContent = this.code;
  //       Prism.highlightElement(this.codeEle.nativeElement);
  //     }
  //   }
  // }
}