grammar PhantomSQL;
//REf .http://www.antlr.org/wiki/display/ANTLR3/Tree+construction

options {  
  language=Java;  
 // We're going to output an AST.
  output = AST;
  k=2; // two tokens of lookahead
  backtrack = true; // this is so that our  tokens would match following "set" and "select" with only k=2 we can't decite what to match without backtracking
  
  // We're going to process an AST whose nodes are of type CommonTree.
  ASTLabelType = ASTNode;
 
} 

// These are imaginary tokens that will serve as parent nodes
// for grouping other tokens in our AST.
tokens {
	ROOT;
	STATEMENTS;
	WHILE_SELECT;
	SELECT_LIST; // This is the query select list
	INSERT_INTO; // INSERT INTO	
	
	BLOCK; // This node represents BEGIN .. END 
	ARRAY;
	DICTIONARY;
	DICTIONARY_ENTRY;// Just a marker to indicate Key/value in the dictionary node

	
	FUNCTION;
	FUNCTION_NAME;
	FUNCTION_ARG;
	
	ON_READY;

	
	COLUMN;	
	SELECTOR;
	IO;	
	
	EXPR; // Expression Imaginary Token	
	ADD_EXP;
	SUBTRACT_EXP;
	MULTIPLY_EXP;	
	DIVIDE_EXP;
	GT_EXP;
	LT_EXP;
	GTE_EXP;
	LTE_EXP;
	NEQ_EXP;
	EQ_EXP;
	OR_EXP;
	AND_EXP;
	FUN_EXP;
	 
	SELECT_FUNCTION;
	
	BOOLEAN_EXP;
	ALIAS;
	
	VALUE_EXPRESSION;
	
}

@parser::header { 

package com.gbltech.phantomsql;
import com.gbltech.phantomsql.ast.*;

}


@lexer::header { 
package com.gbltech.phantomsql;

import com.gbltech.phantomsql.ast.*;

}


@members {
protected Object recoverFromMismatchedToken(IntStream input,
                                            int ttype,
                                            BitSet follow)
    throws RecognitionException
	{   
	    throw new MismatchedTokenException(ttype, input);
	}   
}


// This is the "start rule".
start_rule :
		(importDeclaration)*
		compilationUnit?		
		subProgram 
	  ;

// CREATE SERVICE service_name
compilationUnit
	: CREATE SERVICE NAME  -> ^(SERVICE NAME)
	;
	

importDeclaration  
  	: IMPORT NAME (DOT NAME)+ aliasDeclaration? -> ^(IMPORT<ImportNode> ^(IMPORT_FUNCTION (NAME)+) aliasDeclaration?)
	;

aliasDeclaration
	: AS NAME -> ^(ALIAS NAME)
	;
subProgram
		: (statement)*   -> ^(STATEMENTS<StatementNode> statement*)
	;

	
statement 
 		: setVariableStatement
		| ifStatement
		| whileStatement
		| forEachStatement
		| loopBreakStatement
 		| value_expression
 		| ioStatement	
		| sql_statement 
		;
 
 /*
 @REf : http://www.antlr.org/wiki/pages/viewpage.action?pageId=1573
commentStatement
	    :  COMMENT_START (options {greedy=false;} : .)* COMMENT_END
    ;
   
 */
			
sql_statement  
		: select_expression
		//| insert_into_expression
		| insert_expression
		;



loopBreakStatement
	: BREAK
	| CONTINUE
	;
	
// select * from http://www.gregbugaj.com
select_expression
	:	SELECT select_function? select_list  fromClause (crawlClause)? (joinClause)? (where_clause)? (limitClause)? (optionClause)? /* (onready_clause)? */ -> ^(SELECT<SelectStatementNode> ^(SELECT_FUNCTION select_function)? select_list fromClause (crawlClause)? (joinClause)? (where_clause)? (limitClause)? (optionClause)? /*(onready_clause)?*/)
	|       SELECT value_expression	 -> ^(SELECT<SelectStatementNode>  value_expression)
	;
	
select_function 
	:	FIRST
	|	LAST
	;
	
optionClause
	:	OPTION expression -> ^(OPTION expression)
	;
	
joinClause 
	: joinExpr (joinExpr)* -> ^(JOIN joinExpr*)
	;	
	
joinExpr 
	: (LEFT)? JOIN LPAREN select_expression RPAREN  -> ^(JOIN LEFT? select_expression)
	;	

limitClause
	:	LIMIT NUMBER -> ^(LIMIT NUMBER)
	;		
	
select_list
	: STAR   	      -> ^(SELECT_LIST ^(COLUMN STAR))
	| columnSelectionList -> ^(SELECT_LIST columnSelectionList)
	;  
	

value_expression
	:       expression        -> ^(VALUE_EXPRESSION<ValueExpressionNode>  expression)
	| 	case_expression   -> ^(VALUE_EXPRESSION<ValueExpressionNode>  case_expression)
	|	select_expression -> ^(VALUE_EXPRESSION<ValueExpressionNode>  select_expression)
	;


columnSelectionList 
	:  value_expression (COMMA! value_expression)*  
	;
	

case_expression 
	:	searchable_case_expression
	;
	
searchable_case_expression 
	: CASE 	( searched_when_clause )+ ( else_clause  )?  END -> ^(CASE<CaseExpressionNode>   (searched_when_clause )+  (else_clause)?) 
	;	

searched_when_clause 
	: WHEN^ value_expression  THEN! value_expression
	;

else_clause
	:	ELSE^ value_expression		
	;

	
/*
column_with_alias
	: (NAME  (AS NAME)?) ->  ^(COLUMN  NAME NAME?)
	;
*/
// fixme : : FROM (CRAWL | CRAWL LPAREN expression RPAREN)? expression  -> ^(FROM ^(expression (^(CRAWL expression?))? ))
fromClause 
	: FROM 
	(
	        expression  (usingClause)? -> ^(FROM<FromNode>  expression (usingClause)?)
	  |	LPAREN select_expression RPAREN-> ^(FROM<FromNode>  select_expression )
	
	)
	;

usingClause 
	:	USING verb WITH expression ->^(USING verb  expression)
	;
	
	
crawlClause
	: CRAWL   expression  (usingClause)? (WHEN expression)? -> ^(CRAWL<CrawlNode>  expression (usingClause)? ^(WHEN expression)? )
	;

verb 	
	: VERB_POST 
	| VERB_GET
	;	


insert_expression 
	: INSERT  NAME  (LPAREN columnInsertList RPAREN)  -> ^(INSERT<InsertNode> NAME  columnInsertList)
;   	
	
	
insert_into_expression
		: INSERT INTO  NAME (LPAREN columnInsertList RPAREN)? select_expression   -> ^(INSERT_INTO  NAME select_expression columnInsertList?)
    ;   	
	
columnInsertList 
	:  (expression (COMMA expression)*)  ->  ^(COLUMN  expression*)
	;
	
	
where_clause  
	 :  WHERE  expression  -> ^(WHERE<WhereNode> expression)
	 ;


searchClause
	: function -> ^(SELECTOR function)
	;
// Left-factored while with proper tree creation
whileStatement
		: WHILE 
		  (
   		   expression block   -> ^(WHILE<WhileSelectNode> expression block)
   		  | select_expression block  -> ^(WHILE<WhileSelectNode> select_expression block)
		  )
	    	;


/*
set @array = [1,2,3]
foreach @item : @array
begin
 print "Value = #{@value}"
end 

*/
forEachStatement
		: FOREACH VARNAME COLON expression block   -> ^(FOREACH<ForEachNode> VARNAME expression block)
	    	;

/*
* IF Statements take following format
IF (@a > 1)
BEGIN
  SET @a = 1 + 2
END
*/
ifStatement 
	: IF LPAREN expression RPAREN block (ELSE  block)? -> ^(IF<IfStatementNode> expression block block?)
	;
	
block
	:  BEGIN  subProgram  END -> ^(BLOCK<BlockNode> subProgram)
    ;


/*
Function Call with possible following of subscript []
ex 	: @me = "It"
This works " NAME  function_arguments (AS NAME )? (LBRACKET  expression  RBRACKET)? -> ^(FUNCTION<FunctionNode>  NAME  function_arguments? (NAME)?  ^(ARRAY expression)?)"
but should be better
*/
function 
	: NAME  function_arguments (LBRACKET  expression  RBRACKET)? -> ^(FUNCTION<FunctionNode>  NAME  function_arguments?  ^(ARRAY expression)?)
	;
	 
	

// Column namess can be  selector.name   or name or  selector.*

function_arguments
	: LPAREN expression? (COMMA expression)*   RPAREN  ->^(FUNCTION_ARG expression*)
	;


setVariableStatement 	
	:  varReference  EQ   value_expression  -> ^(SET<SetVariableNode>  varReference value_expression)	 
	;
	
	
// Input statement print load
/*
ioStatement 
	: PRINT ( 
	  VARNAME 	-> ^(IO PRINT VARNAME)
	| STRING_LITERAL  -> ^(IO  PRINT STRING_LITERAL)	
	| expression   -> ^(IO PRINT expression)	
	| function  -> ^(IO  PRINT function)
	)	
	;	
*/

/*
Example : print "Value :" + (1+2)
*/
ioStatement 
	: PRINT expression  -> ^(IO<IONode> ^(PRINT expression))
	;

/*
@Ref http://stackoverflow.com/questions/1451728/antlr-operator-precedence
@Ref http://www.antlr.org/wiki/display/ANTLR3/Tree+construction
@Ref http://www.antlr.org/wiki/display/~admin/2008/03/23/Faster+expression+parsing+for+ANTLR
expr:  mult ('+' mult)* ;
mult:  atom ('*' atom)* ;
atom:  INT | '(' expr ')' ;
*/

/*
subExpr :        (a=logicalAndExp->$a) // set result
                (    addSubtractOp b=logicalAndExp
                     -> ^(addSubtractOp $ $b) // use previous rule result
                )*
	;
*/

// This way we get rid of the leftrecursive error   
expression 
	: subExpr (AS NAME)? -> ^(EXPR<ExpressionNode> subExpr ^(ALIAS NAME)?)
	;
 
subExpr:  logicalAndExp (addSubtractOp^ logicalAndExp)*
	;
		
logicalAndExp
	: logicalOrExp (multiplyDivideOp^  logicalOrExp)*	 
	;

logicalOrExp
	: comparatorExp (CARET^  comparatorExp)* 	
	;
		
comparatorExp
	: powExp (comparatorOp^  powExp)* 	
	;

	
powExp 	: multExp (orOp^   multExp)*  
	;
	

multExp	
	:  functionExp (andOp^ functionExp)*
	;

functionExp	:  expressionAtom (dotOp^ expressionAtom)*
	;

 
/*
Using syntactic predicates to distinguish between
set @me = [1,2,3]   -- array declaration expressin
print @me   --- variable access
print @me[0]  -- variableassess with subscript
*/
expressionAtom
	:  varReference
	|  arrayExpr	
	|  dictionaryExpr	
	|  function  
	|  constantValue
	//|   quotedName
 	|  ( LPAREN! subExpr^ RPAREN! )  
	;


	 
/*
@variable
@variable[0]
*/	 
varReference
	: (VARNAME LBRACKET  expression  RBRACKET) => VARNAME (LBRACKET  expression  RBRACKET)*  -> ^(VARNAME  expression*)
	| (VARNAME) => VARNAME 
	;
	
/*
Our datastructures are based on python

http://docs.python.org/tutorial/datastructures.html
*/
	
// set @array = [1,2,3]
// print  [1,2,3]
arrayExpr 
	: LBRACKET  expression? (COMMA expression)*  RBRACKET  ->^(ARRAY expression*)
	;


dictionaryExpr 
	//:	LBRACE constantValue COLON expression? (COMMA constantValue COLON expression)*  RBRACE  ->^(DICTIONARY ^(constantValue expression)*)
	//:	LBRACE! (expression COLON! expression)^ (COMMA! expression COLON! expression)*  RBRACE!
	:	LBRACE (dictionaryEntry (COMMA dictionaryEntry)*)*  RBRACE  -> ^(DICTIONARY dictionaryEntry*)
	//:	LBRACE constantValue COLON expression? (COMMA constantValue COLON expression)*  RBRACE  ->^(DICTIONARY constantValue* expression*)
	//:	LBRACE constantValue! COLON expression? (COMMA constantValue COLON expression)*  RBRACE 
	;
	
dictionaryEntry
	: constantValue COLON expression ->  ^(DICTIONARY_ENTRY  constantValue expression)
	;


addSubtractOp 
	:	PLUS ->^(ADD_EXP)
	|       MINUS ->^(SUBTRACT_EXP)
	;    
	
multiplyDivideOp 
	:	STAR ->^(MULTIPLY_EXP)
	|       SLASH ->^(DIVIDE_EXP)
	;    

comparatorOp  
	:	GT	 ->^(GT_EXP)
	|       LT	 ->^(LT_EXP)
	| 	GTE	 ->^(GTE_EXP)
	|	LTE      ->^(LTE_EXP)
	|	NEQ      ->^(NEQ_EXP)
	|	EQEQ     ->^(EQ_EXP)
	;    

orOp	:	BARBAR ->^(OR_EXP)
	;
	
andOp	:	AMPAMP ->^(AND_EXP)
	;	

dotOp	:	DOT ->^(FUN_EXP)
	;	



//FIXME : Fix this mapping 
/*
Need to figure out how to separeate NAME and VARNAME
*/
constantValue
	: STRING_LITERAL
	| URL
 	| NUMBER   
 	| CONST_LITERAL
 	| booleanExp -> ^(BOOLEAN_EXP booleanExp) 	
	;

booleanExp 
	:	TRUE
	|	FALSE
	;

 /*
quotedName 
	:	(SINGLE_QUOTE! NAME^ SINGLE_QUOTE!)
	;
*/		
terminator: NEWLINE | EOF;



/********************************************************************************************
                  Lexer section
*********************************************************************************************/



NEWLINE
    :   (('\u000C')?('\r')? '\n' )+
   	 {
            $channel=HIDDEN;
         }
    ;

WS  :    (' '|'\t'|'\u000C')+ {$channel=HIDDEN;}
    ;

 
CRAWL
	:'crawl'
	;

CREATE  :'create'
	;
	
CASE 	: 'case'
	;

THEN	: 'then'
	;

SERVICE : 'service'
	;

INSERT : 'insert'
	;
	
INTO : 'into'
	;
	
IF	:'if'
	;	

ELSE	:'else'
	;	
		
ON 	:	'on'
	;
	
READY	: 'ready'
	;

PRINT
	:	'print'
	;
	
URL :   ('http')('s')?('://')('a'..'z'|'A'..'Z'|'0'..'9')('a'..'z'|'A'..'Z'|'0'..'9'|'.'|'_'|'-'|'/'|'%'|'&')+;

ALL 	:	'all'
	;
	
AND 	
    :	 'and'
    ;
    
OR 	
    :	 'or' 
    ;


WHERE	: 'where'
	;
        

DISTINCT 
	:	'distinct'
	;
	
		
SET	
	:	'set'
	;
	
	
SELECT 
	:	'select'
	;

FROM 
 	:	'from'
	;

VERB_GET 
 	:	'get'
	;
	
VERB_POST
 	:	'post' 
	;
		
DECLARE	
	:	'declare'
	;


STRING_TYPE 
	:	'string'
	;


URL_TYPE 
	:	'url'
	;
		
INTEGER_TYPE 
	:	'int'
	;



BEGIN
	: 	 'begin' 
	;	


END
	:	'end' 
	;	
	
WHILE
	:	'while'
	;		

	
FOREACH
	:	'foreach'
	;		


BREAK
	:	'break'
	;		


CONTINUE
	:	'continue'
	;		


LEFT 	:	'left'
	;
	
JOIN 	:	'join'
	;
		
TRUE
    :   'true'
    ;
 
FALSE
    :   'false'
    ;
 
NULL
    :   'null'
    ;
   	

AS	: 'as'
	;	

WITH	: 'with'
	;	


USING	: 'using'
	;	

FIRST 	: 'first'
	;
	
LAST	: 'last'
	;	

QUOTE	: '"'
	;	

NOT 	: 'not'
	;
	
EXISTS 	: 'exists'
	;


LIMIT 	: 'limit'
	;	
	


OPTION 	: 'option'
	;
	
WHEN 	: 'when'
	;	


IMPORT 	: 'import'
	;	


IMPORT_FUNCTION: 'function'
	;	

	

SINGLE_QUOTE	: '\''
	;	

// This is our identifier @ABla
	
VARNAME 	  
	: 
	MONKEYS_AT LETTER (DIGIT | LETTER | UNDERBAR)*  
	;

// Function name arra
NAME 	  
	:
	LETTER (DIGIT | LETTER | UNDERBAR | UNDERSCORE)*
	//LETTER (DIGIT | LETTER | UNDERBAR | LBRACKET | RBRACKET | DOT | UNDERSCORE)*
	;

	
/*  
STRING_LITERAL
  : '"'
    ( '"' '"'
    | ~('"'|'\n'|'\r')
    )*
    ( '"'
    | // nothing -- write error message
    )
   ;
*/    

   
      
fragment  LETTER 
	:  LOWER_CASE_LETTER | UPPER_CASE_LETTER
	 ;
	
		
	
fragment LOWER_CASE_LETTER 
	:	'a'..'z';
	
fragment UPPER_CASE_LETTER 
	:	'A'..'Z';
	

fragment DIGIT :   '0'..'9';

NUMBER :   DIGIT+ (DOT DIGIT+)?;


fragment DOLLAR
    :   '$'
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
 

EQ
    :   '='
    ;
 
BANG
    :   '!'
    ;
 
TILDE
    :   '~'
    ;
 
QUES
    :   '?'
    ;
 
COLON
    :   ':'
    ;
 
EQEQ
    :   '=='
        ;
 
AMPAMP
    :   '&&'
    ;
 
BARBAR
    :   '||'
    ;
 
PLUSPLUS
    :   '++'
    ;
 
fragment SUBSUB
    :   '--'
    ;
 
PLUS
    :   '+'
    ;
 
MINUS
    :   '-'
    ;
    
fragment UNDERBAR
    :   '-'
    ;
 
fragment UNDERSCORE
    :   '_'
    ;
STAR
    :   '*'
    ;
 
SLASH
    :   '/'
    ;
 
AMP
    :   '&'
    ;
 
BAR
    :   '|'
    ;
 
CARET
    :   '^'
    ;
 
PERCENT
    :   '%'
    ;
 
PLUSEQ
    :   '+='
    ; 
    
SUBEQ
    :   '-='
    ;
 
STAREQ
    :   '*='
    ;
 
SLASHEQ
    :   '/='
    ;
 
AMPEQ 
    :   '&='
    ;
 
BAREQ
    :   '|='
    ;
 
CARETEQ
    :   '^='
    ;
 
PERCENTEQ
    :   '%='
    ;
 
MONKEYS_AT
    :   '@'
    ;
 
fragment HASH
    :   '#'
    ;
 
 
NEQ
    :   '!='
    ;
 
GT
    :   '>'
    ;
 
  
GTE
    :   '>='
    ;
    
LT
    :   '<'
    ;

LTE
    :   '<='
    ;

INSERTION_OP
    :   '->'
    ;

CONST_LITERAL 
  :  '\'' NAME '\''
  ;

fragment
CONST_GUTS
  :  NAME
  ;


    
STRING_LITERAL 
  :  '"' STRING_GUTS '"'
  ;

fragment
STRING_GUTS
  :  (ESC | ~('\\' | '"'))*
  ;

// also a fragment rule perhaps?
ESC
  :  '\\' ('\\' | '"')
  ;
  
/*
COMMENT_SINGLE_LINE 
	:	'//'
	{
//            $channel=HIDDEN;
	SKIP();
       }
;  
  
*/


// Taken from http://www.antlr.org/grammar/list
// C o m m e n t   T o k e n s
fragment
Start_Comment   : '/*';

fragment
End_Comment     : '*/';

fragment
Line_Comment    : '//';

COMMENT
    :   (   Start_Comment ( options {greedy=false;} : . )* End_Comment )+ 
		{
//			$channel=HIDDEN;
			skip();
		} 
    ;

LINE_COMMENT
    : 	(   ( Line_Comment | '--' ) ~('\n'|'\r')* '\r'? '\n')+ 
		{
//			$channel=HIDDEN;
			skip();
		} 
    ;

