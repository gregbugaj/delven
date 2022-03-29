grammar PhantomSql;

@header {
// package com.phantomsql.parser;
}


//https://github.com/quartamsoftware/antlr-hypertalk-grammar/pull/1/files
// CaseInsensitiveInputStream.java
// https://gist.github.com/sharwell/9424666

// Antlr4 rules
// http://stackoverflow.com/questions/29777778/antlr-4-5-mismatched-input-x-expecting-x

sql_statement
		: select_expression terminator
		;

select_expression
	:	SELECT select_list fromClause
	;
select_list

    : STAR
    | columnSelectionList
    ;

columnSelectionList
	:  value_expression (COMMA value_expression)*
	;

fromClause
	: FROM
	(
	   expression
      | URL
      |	from_expression  (COMMA from_expression)*
	)
    ;

from_expression
	: LPAREN select_expression RPAREN AS NAME
    ;

value_expression
	:   function  (DOT value_expression)*
	;

// CSS({"arg":"value"})  OR  CSS("#selector")
// : NAME  function_arguments (LBRACKET  expression  RBRACKET)?
function
	: NAME function_arguments
	;

function_arguments
	: LPAREN expression? (COMMA expression)* RPAREN
	;

expression
    : json
    ;

terminator: NEWLINE | EOF;



// JSON SPECIFIC

json
   : value
   ;

obj
   : '{' pair (',' pair)* '}'
   | '{' '}'
   ;

pair
   : STRING ':' value
   ;

array
   : '[' value (',' value)* ']'
   | '[' ']'
   ;

value
   : STRING
   | NUMBER
   | obj
   | array
   | 'true'
   | 'false'
   | 'null'
   ;


STRING
   : '"' (ESC | ~ ["\\])* '"'
   ;
NUMBER

   : '-'? INT '.' [0-9] + EXP? | '-'? INT EXP | '-'? INT
   ;

fragment ESC
   : '\\' (["\\/bfnrt] | UNICODE)
   ;

fragment UNICODE
   : 'u' HEX HEX HEX HEX
   ;

fragment HEX
   : [0-9a-fA-F]
   ;

fragment INT
   : '0' | [1-9] [0-9]*
   ;

// no leading zeros
fragment EXP
   : [Ee] [+\-]? INT
   ;

// \- since - means "range" inside [...]
WS
   : [ \t\n\r] + -> skip
   ;


// Taken from http://www.antlr.org/grammar/list
// C o m m e n t   T o k e n s
fragment
Start_Comment   : '/*';

fragment
End_Comment     : '*/';

fragment
Line_Comment    : '//';

COMMENT
    :   (   Start_Comment  (.)*? End_Comment )+ -> skip

    ;

LINE_COMMENT
    : 	(   ( Line_Comment | '--' ) ~('\n'|'\r')* '\r'? '\n')+ -> skip
    ;


NEWLINE
    :   (('\u000C')?('\r')? '\n' )+ -> skip
    ;

URL :   ('http')('s')?('://')('a'..'z'|'A'..'Z'|'0'..'9')('a'..'z'|'A'..'Z'|'0'..'9'|'.'|'_'|'-'|'/'|'%'|'&')+;

fragment  LETTER
	 :  LOWER_CASE_LETTER | UPPER_CASE_LETTER
	 ;


fragment LOWER_CASE_LETTER
	:	'a'..'z';

fragment UPPER_CASE_LETTER
	:	'A'..'Z';


fragment DIGIT :   '0'..'9';
// NUMBER :   DIGIT+ (DOT DIGIT+)?;


fragment DOLLAR
    :   '$'
    ;

fragment UNDERBAR
    :   '-'
    ;

fragment UNDERSCORE
    :   '_'
    ;
LPAREN
    :   '('
    ;

RPAREN
    :   ')'
    ;

LBRACE
    :   '{'
    ;

RBRACE
    :   '}'
    ;

LBRACKET
    :   '['
    ;

RBRACKET
    :   ']'
    ;

SEMI
    :   ';'
    ;

 COMMA
    :   ','
    ;

 DOT
    :   '.'
    ;

 STAR
    :   '*'
    ;

 AS
    :   'AS'
    ;


// ******************* ALPABET **************** //


fragment A : ('a'|'A');
fragment B : ('b'|'B');
fragment C : ('c'|'C');
fragment D : ('d'|'D');
fragment E : ('e'|'E');
fragment F : ('f'|'F');
fragment G : ('g'|'G');
fragment H : ('h'|'H');
fragment I : ('i'|'I');
fragment J : ('j'|'J');
fragment K : ('k'|'K');
fragment L : ('l'|'L');
fragment M : ('m'|'M');
fragment N : ('n'|'N');
fragment O : ('o'|'O');
fragment P : ('p'|'P');
fragment Q : ('q'|'Q');
fragment R : ('r'|'R');
fragment S : ('s'|'S');
fragment T : ('t'|'T');
fragment U : ('u'|'U');
fragment V : ('v'|'V');
fragment W : ('w'|'W');
fragment X : ('x'|'X');
fragment Y : ('y'|'Y');
fragment Z : ('z'|'Z');


SELECT
    : S E L E C T
    ;

FROM
    : F R O M
    ;

NAME
	: LETTER (DIGIT | LETTER | UNDERBAR | UNDERSCORE)*
	;
