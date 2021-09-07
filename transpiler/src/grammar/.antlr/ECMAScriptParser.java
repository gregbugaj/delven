// Generated from /home/gbugaj/devio/delv/delven/transpiler/src/grammar/ECMAScriptParser.g4 by ANTLR 4.8
import org.antlr.v4.runtime.atn.*;
import org.antlr.v4.runtime.dfa.DFA;
import org.antlr.v4.runtime.*;
import org.antlr.v4.runtime.misc.*;
import org.antlr.v4.runtime.tree.*;
import java.util.List;
import java.util.Iterator;
import java.util.ArrayList;

@SuppressWarnings({"all", "warnings", "unchecked", "unused", "cast"})
public class ECMAScriptParser extends ECMAScriptParserBase {
	static { RuntimeMetaData.checkVersion("4.8", RuntimeMetaData.VERSION); }

	protected static final DFA[] _decisionToDFA;
	protected static final PredictionContextCache _sharedContextCache =
		new PredictionContextCache();
	public static final int
		HashBangLine=1, MultiLineComment=2, SingleLineComment=3, RegularExpressionLiteral=4, 
		OpenBracket=5, CloseBracket=6, OpenParen=7, CloseParen=8, OpenBrace=9, 
		CloseBrace=10, SemiColon=11, Comma=12, Assign=13, QuestionMark=14, Colon=15, 
		Ellipsis=16, Dot=17, PlusPlus=18, MinusMinus=19, Plus=20, Minus=21, BitNot=22, 
		Not=23, Multiply=24, Divide=25, Modulus=26, Power=27, NullCoalesce=28, 
		Hashtag=29, RightShiftArithmetic=30, LeftShiftArithmetic=31, RightShiftLogical=32, 
		LessThan=33, MoreThan=34, LessThanEquals=35, GreaterThanEquals=36, Equals_=37, 
		NotEquals=38, IdentityEquals=39, IdentityNotEquals=40, BitAnd=41, BitXOr=42, 
		BitOr=43, And=44, Or=45, MultiplyAssign=46, DivideAssign=47, ModulusAssign=48, 
		PlusAssign=49, MinusAssign=50, LeftShiftArithmeticAssign=51, RightShiftArithmeticAssign=52, 
		RightShiftLogicalAssign=53, BitAndAssign=54, BitXorAssign=55, BitOrAssign=56, 
		PowerAssign=57, ARROW=58, NullLiteral=59, BooleanLiteral=60, DecimalLiteral=61, 
		HexIntegerLiteral=62, OctalIntegerLiteral=63, OctalIntegerLiteral2=64, 
		BinaryIntegerLiteral=65, BigHexIntegerLiteral=66, BigOctalIntegerLiteral=67, 
		BigBinaryIntegerLiteral=68, BigDecimalIntegerLiteral=69, Break=70, Do=71, 
		Instanceof=72, Typeof=73, Case=74, Else=75, New=76, Var=77, Catch=78, 
		Finally=79, Return=80, Void=81, Continue=82, For=83, Switch=84, While=85, 
		Debugger=86, Function=87, This=88, With=89, Default=90, If=91, Throw=92, 
		Delete=93, In=94, Try=95, As=96, From=97, Let=98, Class=99, Enum=100, 
		Extends=101, Super=102, Const=103, Export=104, Import=105, Async=106, 
		Await=107, Url=108, Select=109, Union=110, Where=111, Join=112, On=113, 
		Produce=114, Using=115, All=116, Within=117, Implements=118, StrictLet=119, 
		NonStrictLet=120, Private=121, Public=122, Interface=123, Package=124, 
		Protected=125, Static=126, Yield=127, Identifier=128, StringLiteral=129, 
		TemplateStringLiteral=130, WhiteSpaces=131, LineTerminator=132, NEWLINE=133, 
		HtmlComment=134, CDataComment=135, UnexpectedCharacter=136;
	public static final int
		RULE_program = 0, RULE_sourceElement = 1, RULE_statement = 2, RULE_block = 3, 
		RULE_statementList = 4, RULE_importStatement = 5, RULE_importFromBlock = 6, 
		RULE_moduleItems = 7, RULE_importDefault = 8, RULE_importNamespace = 9, 
		RULE_importFrom = 10, RULE_aliasName = 11, RULE_exportStatement = 12, 
		RULE_exportFromBlock = 13, RULE_declaration = 14, RULE_variableStatement = 15, 
		RULE_variableDeclarationList = 16, RULE_variableDeclaration = 17, RULE_emptyStatement = 18, 
		RULE_expressionStatement = 19, RULE_ifStatement = 20, RULE_iterationStatement = 21, 
		RULE_varModifier = 22, RULE_continueStatement = 23, RULE_breakStatement = 24, 
		RULE_returnStatement = 25, RULE_withStatement = 26, RULE_switchStatement = 27, 
		RULE_caseBlock = 28, RULE_caseClauses = 29, RULE_caseClause = 30, RULE_defaultClause = 31, 
		RULE_labelledStatement = 32, RULE_throwStatement = 33, RULE_tryStatement = 34, 
		RULE_catchProduction = 35, RULE_finallyProduction = 36, RULE_debuggerStatement = 37, 
		RULE_functionDeclaration = 38, RULE_classDeclaration = 39, RULE_classTail = 40, 
		RULE_classHeritage = 41, RULE_classElement = 42, RULE_methodDefinition = 43, 
		RULE_formalParameterList = 44, RULE_formalParameterArg = 45, RULE_lastFormalParameterArg = 46, 
		RULE_functionBody = 47, RULE_sourceElements = 48, RULE_arrayLiteral = 49, 
		RULE_elementList = 50, RULE_arrayElement = 51, RULE_propertyAssignment = 52, 
		RULE_propertyName = 53, RULE_arguments = 54, RULE_argument = 55, RULE_expressionSequence = 56, 
		RULE_singleExpression = 57, RULE_assignable = 58, RULE_objectLiteral = 59, 
		RULE_anoymousFunction = 60, RULE_arrowFunctionParameters = 61, RULE_arrowFunctionBody = 62, 
		RULE_assignmentOperator = 63, RULE_literal = 64, RULE_numericLiteral = 65, 
		RULE_bigintLiteral = 66, RULE_getter = 67, RULE_setter = 68, RULE_identifierName = 69, 
		RULE_identifier = 70, RULE_reservedWord = 71, RULE_keyword = 72, RULE_eos = 73, 
		RULE_querySelectStatement = 74, RULE_queryExpression = 75, RULE_sql_union = 76, 
		RULE_querySpecification = 77, RULE_select_list = 78, RULE_select_list_elem = 79, 
		RULE_fromClause = 80, RULE_whereClause = 81, RULE_dataSources = 82, RULE_dataSource = 83, 
		RULE_data_source_item_joined = 84, RULE_data_source_item = 85, RULE_join_clause = 86, 
		RULE_using_source_clause = 87, RULE_produce_clause = 88, RULE_bind_clause = 89, 
		RULE_withinClause = 90, RULE_queryObjectLiteral = 91, RULE_queryPropertyAssignment = 92;
	private static String[] makeRuleNames() {
		return new String[] {
			"program", "sourceElement", "statement", "block", "statementList", "importStatement", 
			"importFromBlock", "moduleItems", "importDefault", "importNamespace", 
			"importFrom", "aliasName", "exportStatement", "exportFromBlock", "declaration", 
			"variableStatement", "variableDeclarationList", "variableDeclaration", 
			"emptyStatement", "expressionStatement", "ifStatement", "iterationStatement", 
			"varModifier", "continueStatement", "breakStatement", "returnStatement", 
			"withStatement", "switchStatement", "caseBlock", "caseClauses", "caseClause", 
			"defaultClause", "labelledStatement", "throwStatement", "tryStatement", 
			"catchProduction", "finallyProduction", "debuggerStatement", "functionDeclaration", 
			"classDeclaration", "classTail", "classHeritage", "classElement", "methodDefinition", 
			"formalParameterList", "formalParameterArg", "lastFormalParameterArg", 
			"functionBody", "sourceElements", "arrayLiteral", "elementList", "arrayElement", 
			"propertyAssignment", "propertyName", "arguments", "argument", "expressionSequence", 
			"singleExpression", "assignable", "objectLiteral", "anoymousFunction", 
			"arrowFunctionParameters", "arrowFunctionBody", "assignmentOperator", 
			"literal", "numericLiteral", "bigintLiteral", "getter", "setter", "identifierName", 
			"identifier", "reservedWord", "keyword", "eos", "querySelectStatement", 
			"queryExpression", "sql_union", "querySpecification", "select_list", 
			"select_list_elem", "fromClause", "whereClause", "dataSources", "dataSource", 
			"data_source_item_joined", "data_source_item", "join_clause", "using_source_clause", 
			"produce_clause", "bind_clause", "withinClause", "queryObjectLiteral", 
			"queryPropertyAssignment"
		};
	}
	public static final String[] ruleNames = makeRuleNames();

	private static String[] makeLiteralNames() {
		return new String[] {
			null, null, null, null, null, "'['", "']'", "'('", "')'", "'{'", "'}'", 
			"';'", "','", "'='", "'?'", "':'", "'...'", "'.'", "'++'", "'--'", "'+'", 
			"'-'", "'~'", "'!'", "'*'", "'/'", "'%'", "'**'", "'??'", "'#'", "'>>'", 
			"'<<'", "'>>>'", "'<'", "'>'", "'<='", "'>='", "'=='", "'!='", "'==='", 
			"'!=='", "'&'", "'^'", "'|'", "'&&'", "'||'", "'*='", "'/='", "'%='", 
			"'+='", "'-='", "'<<='", "'>>='", "'>>>='", "'&='", "'^='", "'|='", "'**='", 
			"'=>'", "'null'", null, null, null, null, null, null, null, null, null, 
			null, "'break'", "'do'", "'instanceof'", "'typeof'", "'case'", "'else'", 
			"'new'", "'var'", "'catch'", "'finally'", "'return'", "'void'", "'continue'", 
			"'for'", "'switch'", "'while'", "'debugger'", "'function'", "'this'", 
			"'with'", "'default'", "'if'", "'throw'", "'delete'", "'in'", "'try'", 
			"'as'", "'from'", null, "'class'", "'enum'", "'extends'", "'super'", 
			"'const'", "'export'", "'import'", "'async'", "'await'", null, "'select'", 
			"'union'", "'where'", "'join'", "'on'", "'produce'", "'using'", "'all'", 
			"'within'", "'implements'", null, null, "'private'", "'public'", "'interface'", 
			"'package'", "'protected'", "'static'", "'yield'", null, null, null, 
			null, null, "'\n'"
		};
	}
	private static final String[] _LITERAL_NAMES = makeLiteralNames();
	private static String[] makeSymbolicNames() {
		return new String[] {
			null, "HashBangLine", "MultiLineComment", "SingleLineComment", "RegularExpressionLiteral", 
			"OpenBracket", "CloseBracket", "OpenParen", "CloseParen", "OpenBrace", 
			"CloseBrace", "SemiColon", "Comma", "Assign", "QuestionMark", "Colon", 
			"Ellipsis", "Dot", "PlusPlus", "MinusMinus", "Plus", "Minus", "BitNot", 
			"Not", "Multiply", "Divide", "Modulus", "Power", "NullCoalesce", "Hashtag", 
			"RightShiftArithmetic", "LeftShiftArithmetic", "RightShiftLogical", "LessThan", 
			"MoreThan", "LessThanEquals", "GreaterThanEquals", "Equals_", "NotEquals", 
			"IdentityEquals", "IdentityNotEquals", "BitAnd", "BitXOr", "BitOr", "And", 
			"Or", "MultiplyAssign", "DivideAssign", "ModulusAssign", "PlusAssign", 
			"MinusAssign", "LeftShiftArithmeticAssign", "RightShiftArithmeticAssign", 
			"RightShiftLogicalAssign", "BitAndAssign", "BitXorAssign", "BitOrAssign", 
			"PowerAssign", "ARROW", "NullLiteral", "BooleanLiteral", "DecimalLiteral", 
			"HexIntegerLiteral", "OctalIntegerLiteral", "OctalIntegerLiteral2", "BinaryIntegerLiteral", 
			"BigHexIntegerLiteral", "BigOctalIntegerLiteral", "BigBinaryIntegerLiteral", 
			"BigDecimalIntegerLiteral", "Break", "Do", "Instanceof", "Typeof", "Case", 
			"Else", "New", "Var", "Catch", "Finally", "Return", "Void", "Continue", 
			"For", "Switch", "While", "Debugger", "Function", "This", "With", "Default", 
			"If", "Throw", "Delete", "In", "Try", "As", "From", "Let", "Class", "Enum", 
			"Extends", "Super", "Const", "Export", "Import", "Async", "Await", "Url", 
			"Select", "Union", "Where", "Join", "On", "Produce", "Using", "All", 
			"Within", "Implements", "StrictLet", "NonStrictLet", "Private", "Public", 
			"Interface", "Package", "Protected", "Static", "Yield", "Identifier", 
			"StringLiteral", "TemplateStringLiteral", "WhiteSpaces", "LineTerminator", 
			"NEWLINE", "HtmlComment", "CDataComment", "UnexpectedCharacter"
		};
	}
	private static final String[] _SYMBOLIC_NAMES = makeSymbolicNames();
	public static final Vocabulary VOCABULARY = new VocabularyImpl(_LITERAL_NAMES, _SYMBOLIC_NAMES);

	/**
	 * @deprecated Use {@link #VOCABULARY} instead.
	 */
	@Deprecated
	public static final String[] tokenNames;
	static {
		tokenNames = new String[_SYMBOLIC_NAMES.length];
		for (int i = 0; i < tokenNames.length; i++) {
			tokenNames[i] = VOCABULARY.getLiteralName(i);
			if (tokenNames[i] == null) {
				tokenNames[i] = VOCABULARY.getSymbolicName(i);
			}

			if (tokenNames[i] == null) {
				tokenNames[i] = "<INVALID>";
			}
		}
	}

	@Override
	@Deprecated
	public String[] getTokenNames() {
		return tokenNames;
	}

	@Override

	public Vocabulary getVocabulary() {
		return VOCABULARY;
	}

	@Override
	public String getGrammarFileName() { return "ECMAScriptParser.g4"; }

	@Override
	public String[] getRuleNames() { return ruleNames; }

	@Override
	public String getSerializedATN() { return _serializedATN; }

	@Override
	public ATN getATN() { return _ATN; }

	public ECMAScriptParser(TokenStream input) {
		super(input);
		_interp = new ParserATNSimulator(this,_ATN,_decisionToDFA,_sharedContextCache);
	}

	public static class ProgramContext extends ParserRuleContext {
		public TerminalNode EOF() { return getToken(ECMAScriptParser.EOF, 0); }
		public TerminalNode HashBangLine() { return getToken(ECMAScriptParser.HashBangLine, 0); }
		public SourceElementsContext sourceElements() {
			return getRuleContext(SourceElementsContext.class,0);
		}
		public ProgramContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_program; }
	}

	public final ProgramContext program() throws RecognitionException {
		ProgramContext _localctx = new ProgramContext(_ctx, getState());
		enterRule(_localctx, 0, RULE_program);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(187);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,0,_ctx) ) {
			case 1:
				{
				setState(186);
				match(HashBangLine);
				}
				break;
			}
			setState(190);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,1,_ctx) ) {
			case 1:
				{
				setState(189);
				sourceElements();
				}
				break;
			}
			setState(192);
			match(EOF);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class SourceElementContext extends ParserRuleContext {
		public StatementContext statement() {
			return getRuleContext(StatementContext.class,0);
		}
		public SourceElementContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_sourceElement; }
	}

	public final SourceElementContext sourceElement() throws RecognitionException {
		SourceElementContext _localctx = new SourceElementContext(_ctx, getState());
		enterRule(_localctx, 2, RULE_sourceElement);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(194);
			statement();
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class StatementContext extends ParserRuleContext {
		public BlockContext block() {
			return getRuleContext(BlockContext.class,0);
		}
		public QuerySelectStatementContext querySelectStatement() {
			return getRuleContext(QuerySelectStatementContext.class,0);
		}
		public VariableStatementContext variableStatement() {
			return getRuleContext(VariableStatementContext.class,0);
		}
		public ImportStatementContext importStatement() {
			return getRuleContext(ImportStatementContext.class,0);
		}
		public ExportStatementContext exportStatement() {
			return getRuleContext(ExportStatementContext.class,0);
		}
		public EmptyStatementContext emptyStatement() {
			return getRuleContext(EmptyStatementContext.class,0);
		}
		public ClassDeclarationContext classDeclaration() {
			return getRuleContext(ClassDeclarationContext.class,0);
		}
		public FunctionDeclarationContext functionDeclaration() {
			return getRuleContext(FunctionDeclarationContext.class,0);
		}
		public ExpressionStatementContext expressionStatement() {
			return getRuleContext(ExpressionStatementContext.class,0);
		}
		public IfStatementContext ifStatement() {
			return getRuleContext(IfStatementContext.class,0);
		}
		public IterationStatementContext iterationStatement() {
			return getRuleContext(IterationStatementContext.class,0);
		}
		public ContinueStatementContext continueStatement() {
			return getRuleContext(ContinueStatementContext.class,0);
		}
		public BreakStatementContext breakStatement() {
			return getRuleContext(BreakStatementContext.class,0);
		}
		public ReturnStatementContext returnStatement() {
			return getRuleContext(ReturnStatementContext.class,0);
		}
		public WithStatementContext withStatement() {
			return getRuleContext(WithStatementContext.class,0);
		}
		public LabelledStatementContext labelledStatement() {
			return getRuleContext(LabelledStatementContext.class,0);
		}
		public SwitchStatementContext switchStatement() {
			return getRuleContext(SwitchStatementContext.class,0);
		}
		public ThrowStatementContext throwStatement() {
			return getRuleContext(ThrowStatementContext.class,0);
		}
		public TryStatementContext tryStatement() {
			return getRuleContext(TryStatementContext.class,0);
		}
		public DebuggerStatementContext debuggerStatement() {
			return getRuleContext(DebuggerStatementContext.class,0);
		}
		public StatementContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_statement; }
	}

	public final StatementContext statement() throws RecognitionException {
		StatementContext _localctx = new StatementContext(_ctx, getState());
		enterRule(_localctx, 4, RULE_statement);
		try {
			setState(216);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,2,_ctx) ) {
			case 1:
				enterOuterAlt(_localctx, 1);
				{
				setState(196);
				block();
				}
				break;
			case 2:
				enterOuterAlt(_localctx, 2);
				{
				setState(197);
				querySelectStatement();
				}
				break;
			case 3:
				enterOuterAlt(_localctx, 3);
				{
				setState(198);
				variableStatement();
				}
				break;
			case 4:
				enterOuterAlt(_localctx, 4);
				{
				setState(199);
				importStatement();
				}
				break;
			case 5:
				enterOuterAlt(_localctx, 5);
				{
				setState(200);
				exportStatement();
				}
				break;
			case 6:
				enterOuterAlt(_localctx, 6);
				{
				setState(201);
				emptyStatement();
				}
				break;
			case 7:
				enterOuterAlt(_localctx, 7);
				{
				setState(202);
				classDeclaration();
				}
				break;
			case 8:
				enterOuterAlt(_localctx, 8);
				{
				setState(203);
				functionDeclaration();
				}
				break;
			case 9:
				enterOuterAlt(_localctx, 9);
				{
				setState(204);
				expressionStatement();
				}
				break;
			case 10:
				enterOuterAlt(_localctx, 10);
				{
				setState(205);
				ifStatement();
				}
				break;
			case 11:
				enterOuterAlt(_localctx, 11);
				{
				setState(206);
				iterationStatement();
				}
				break;
			case 12:
				enterOuterAlt(_localctx, 12);
				{
				setState(207);
				continueStatement();
				}
				break;
			case 13:
				enterOuterAlt(_localctx, 13);
				{
				setState(208);
				breakStatement();
				}
				break;
			case 14:
				enterOuterAlt(_localctx, 14);
				{
				setState(209);
				returnStatement();
				}
				break;
			case 15:
				enterOuterAlt(_localctx, 15);
				{
				setState(210);
				withStatement();
				}
				break;
			case 16:
				enterOuterAlt(_localctx, 16);
				{
				setState(211);
				labelledStatement();
				}
				break;
			case 17:
				enterOuterAlt(_localctx, 17);
				{
				setState(212);
				switchStatement();
				}
				break;
			case 18:
				enterOuterAlt(_localctx, 18);
				{
				setState(213);
				throwStatement();
				}
				break;
			case 19:
				enterOuterAlt(_localctx, 19);
				{
				setState(214);
				tryStatement();
				}
				break;
			case 20:
				enterOuterAlt(_localctx, 20);
				{
				setState(215);
				debuggerStatement();
				}
				break;
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class BlockContext extends ParserRuleContext {
		public TerminalNode OpenBrace() { return getToken(ECMAScriptParser.OpenBrace, 0); }
		public TerminalNode CloseBrace() { return getToken(ECMAScriptParser.CloseBrace, 0); }
		public StatementListContext statementList() {
			return getRuleContext(StatementListContext.class,0);
		}
		public BlockContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_block; }
	}

	public final BlockContext block() throws RecognitionException {
		BlockContext _localctx = new BlockContext(_ctx, getState());
		enterRule(_localctx, 6, RULE_block);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(218);
			match(OpenBrace);
			setState(220);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,3,_ctx) ) {
			case 1:
				{
				setState(219);
				statementList();
				}
				break;
			}
			setState(222);
			match(CloseBrace);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class StatementListContext extends ParserRuleContext {
		public List<StatementContext> statement() {
			return getRuleContexts(StatementContext.class);
		}
		public StatementContext statement(int i) {
			return getRuleContext(StatementContext.class,i);
		}
		public StatementListContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_statementList; }
	}

	public final StatementListContext statementList() throws RecognitionException {
		StatementListContext _localctx = new StatementListContext(_ctx, getState());
		enterRule(_localctx, 8, RULE_statementList);
		try {
			int _alt;
			enterOuterAlt(_localctx, 1);
			{
			setState(225); 
			_errHandler.sync(this);
			_alt = 1;
			do {
				switch (_alt) {
				case 1:
					{
					{
					setState(224);
					statement();
					}
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				setState(227); 
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,4,_ctx);
			} while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER );
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class ImportStatementContext extends ParserRuleContext {
		public TerminalNode Import() { return getToken(ECMAScriptParser.Import, 0); }
		public ImportFromBlockContext importFromBlock() {
			return getRuleContext(ImportFromBlockContext.class,0);
		}
		public ImportStatementContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_importStatement; }
	}

	public final ImportStatementContext importStatement() throws RecognitionException {
		ImportStatementContext _localctx = new ImportStatementContext(_ctx, getState());
		enterRule(_localctx, 10, RULE_importStatement);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(229);
			match(Import);
			setState(230);
			importFromBlock();
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class ImportFromBlockContext extends ParserRuleContext {
		public TerminalNode StringLiteral() { return getToken(ECMAScriptParser.StringLiteral, 0); }
		public EosContext eos() {
			return getRuleContext(EosContext.class,0);
		}
		public ImportDefaultContext importDefault() {
			return getRuleContext(ImportDefaultContext.class,0);
		}
		public TerminalNode Comma() { return getToken(ECMAScriptParser.Comma, 0); }
		public ImportFromContext importFrom() {
			return getRuleContext(ImportFromContext.class,0);
		}
		public ImportNamespaceContext importNamespace() {
			return getRuleContext(ImportNamespaceContext.class,0);
		}
		public ModuleItemsContext moduleItems() {
			return getRuleContext(ModuleItemsContext.class,0);
		}
		public ImportFromBlockContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_importFromBlock; }
	}

	public final ImportFromBlockContext importFromBlock() throws RecognitionException {
		ImportFromBlockContext _localctx = new ImportFromBlockContext(_ctx, getState());
		enterRule(_localctx, 12, RULE_importFromBlock);
		try {
			setState(255);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,8,_ctx) ) {
			case 1:
				enterOuterAlt(_localctx, 1);
				{
				setState(232);
				match(StringLiteral);
				setState(233);
				eos();
				}
				break;
			case 2:
				enterOuterAlt(_localctx, 2);
				{
				setState(234);
				importDefault();
				setState(235);
				match(Comma);
				setState(238);
				_errHandler.sync(this);
				switch (_input.LA(1)) {
				case Multiply:
				case NullLiteral:
				case BooleanLiteral:
				case Break:
				case Do:
				case Instanceof:
				case Typeof:
				case Case:
				case Else:
				case New:
				case Var:
				case Catch:
				case Finally:
				case Return:
				case Void:
				case Continue:
				case For:
				case Switch:
				case While:
				case Debugger:
				case Function:
				case This:
				case With:
				case Default:
				case If:
				case Throw:
				case Delete:
				case In:
				case Try:
				case As:
				case From:
				case Let:
				case Class:
				case Enum:
				case Extends:
				case Super:
				case Const:
				case Export:
				case Import:
				case Async:
				case Await:
				case Implements:
				case Private:
				case Public:
				case Interface:
				case Package:
				case Protected:
				case Static:
				case Yield:
				case Identifier:
					{
					setState(236);
					importNamespace();
					}
					break;
				case OpenBrace:
					{
					setState(237);
					moduleItems();
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				setState(240);
				importFrom();
				setState(241);
				eos();
				}
				break;
			case 3:
				enterOuterAlt(_localctx, 3);
				{
				setState(246);
				_errHandler.sync(this);
				switch ( getInterpreter().adaptivePredict(_input,6,_ctx) ) {
				case 1:
					{
					setState(243);
					importDefault();
					setState(244);
					match(Comma);
					}
					break;
				}
				setState(250);
				_errHandler.sync(this);
				switch (_input.LA(1)) {
				case Multiply:
				case NullLiteral:
				case BooleanLiteral:
				case Break:
				case Do:
				case Instanceof:
				case Typeof:
				case Case:
				case Else:
				case New:
				case Var:
				case Catch:
				case Finally:
				case Return:
				case Void:
				case Continue:
				case For:
				case Switch:
				case While:
				case Debugger:
				case Function:
				case This:
				case With:
				case Default:
				case If:
				case Throw:
				case Delete:
				case In:
				case Try:
				case As:
				case From:
				case Let:
				case Class:
				case Enum:
				case Extends:
				case Super:
				case Const:
				case Export:
				case Import:
				case Async:
				case Await:
				case Implements:
				case Private:
				case Public:
				case Interface:
				case Package:
				case Protected:
				case Static:
				case Yield:
				case Identifier:
					{
					setState(248);
					importNamespace();
					}
					break;
				case OpenBrace:
					{
					setState(249);
					moduleItems();
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				setState(252);
				importFrom();
				setState(253);
				eos();
				}
				break;
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class ModuleItemsContext extends ParserRuleContext {
		public TerminalNode OpenBrace() { return getToken(ECMAScriptParser.OpenBrace, 0); }
		public TerminalNode CloseBrace() { return getToken(ECMAScriptParser.CloseBrace, 0); }
		public List<AliasNameContext> aliasName() {
			return getRuleContexts(AliasNameContext.class);
		}
		public AliasNameContext aliasName(int i) {
			return getRuleContext(AliasNameContext.class,i);
		}
		public List<TerminalNode> Comma() { return getTokens(ECMAScriptParser.Comma); }
		public TerminalNode Comma(int i) {
			return getToken(ECMAScriptParser.Comma, i);
		}
		public ModuleItemsContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_moduleItems; }
	}

	public final ModuleItemsContext moduleItems() throws RecognitionException {
		ModuleItemsContext _localctx = new ModuleItemsContext(_ctx, getState());
		enterRule(_localctx, 14, RULE_moduleItems);
		int _la;
		try {
			int _alt;
			enterOuterAlt(_localctx, 1);
			{
			setState(257);
			match(OpenBrace);
			setState(263);
			_errHandler.sync(this);
			_alt = getInterpreter().adaptivePredict(_input,9,_ctx);
			while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
				if ( _alt==1 ) {
					{
					{
					setState(258);
					aliasName();
					setState(259);
					match(Comma);
					}
					} 
				}
				setState(265);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,9,_ctx);
			}
			setState(270);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==NullLiteral || _la==BooleanLiteral || ((((_la - 70)) & ~0x3f) == 0 && ((1L << (_la - 70)) & ((1L << (Break - 70)) | (1L << (Do - 70)) | (1L << (Instanceof - 70)) | (1L << (Typeof - 70)) | (1L << (Case - 70)) | (1L << (Else - 70)) | (1L << (New - 70)) | (1L << (Var - 70)) | (1L << (Catch - 70)) | (1L << (Finally - 70)) | (1L << (Return - 70)) | (1L << (Void - 70)) | (1L << (Continue - 70)) | (1L << (For - 70)) | (1L << (Switch - 70)) | (1L << (While - 70)) | (1L << (Debugger - 70)) | (1L << (Function - 70)) | (1L << (This - 70)) | (1L << (With - 70)) | (1L << (Default - 70)) | (1L << (If - 70)) | (1L << (Throw - 70)) | (1L << (Delete - 70)) | (1L << (In - 70)) | (1L << (Try - 70)) | (1L << (As - 70)) | (1L << (From - 70)) | (1L << (Let - 70)) | (1L << (Class - 70)) | (1L << (Enum - 70)) | (1L << (Extends - 70)) | (1L << (Super - 70)) | (1L << (Const - 70)) | (1L << (Export - 70)) | (1L << (Import - 70)) | (1L << (Async - 70)) | (1L << (Await - 70)) | (1L << (Implements - 70)) | (1L << (Private - 70)) | (1L << (Public - 70)) | (1L << (Interface - 70)) | (1L << (Package - 70)) | (1L << (Protected - 70)) | (1L << (Static - 70)) | (1L << (Yield - 70)) | (1L << (Identifier - 70)))) != 0)) {
				{
				setState(266);
				aliasName();
				setState(268);
				_errHandler.sync(this);
				_la = _input.LA(1);
				if (_la==Comma) {
					{
					setState(267);
					match(Comma);
					}
				}

				}
			}

			setState(272);
			match(CloseBrace);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class ImportDefaultContext extends ParserRuleContext {
		public AliasNameContext aliasName() {
			return getRuleContext(AliasNameContext.class,0);
		}
		public ImportDefaultContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_importDefault; }
	}

	public final ImportDefaultContext importDefault() throws RecognitionException {
		ImportDefaultContext _localctx = new ImportDefaultContext(_ctx, getState());
		enterRule(_localctx, 16, RULE_importDefault);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(274);
			aliasName();
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class ImportNamespaceContext extends ParserRuleContext {
		public TerminalNode Multiply() { return getToken(ECMAScriptParser.Multiply, 0); }
		public List<IdentifierNameContext> identifierName() {
			return getRuleContexts(IdentifierNameContext.class);
		}
		public IdentifierNameContext identifierName(int i) {
			return getRuleContext(IdentifierNameContext.class,i);
		}
		public TerminalNode As() { return getToken(ECMAScriptParser.As, 0); }
		public ImportNamespaceContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_importNamespace; }
	}

	public final ImportNamespaceContext importNamespace() throws RecognitionException {
		ImportNamespaceContext _localctx = new ImportNamespaceContext(_ctx, getState());
		enterRule(_localctx, 18, RULE_importNamespace);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(278);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case Multiply:
				{
				setState(276);
				match(Multiply);
				}
				break;
			case NullLiteral:
			case BooleanLiteral:
			case Break:
			case Do:
			case Instanceof:
			case Typeof:
			case Case:
			case Else:
			case New:
			case Var:
			case Catch:
			case Finally:
			case Return:
			case Void:
			case Continue:
			case For:
			case Switch:
			case While:
			case Debugger:
			case Function:
			case This:
			case With:
			case Default:
			case If:
			case Throw:
			case Delete:
			case In:
			case Try:
			case As:
			case From:
			case Let:
			case Class:
			case Enum:
			case Extends:
			case Super:
			case Const:
			case Export:
			case Import:
			case Async:
			case Await:
			case Implements:
			case Private:
			case Public:
			case Interface:
			case Package:
			case Protected:
			case Static:
			case Yield:
			case Identifier:
				{
				setState(277);
				identifierName();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			setState(282);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==As) {
				{
				setState(280);
				match(As);
				setState(281);
				identifierName();
				}
			}

			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class ImportFromContext extends ParserRuleContext {
		public TerminalNode From() { return getToken(ECMAScriptParser.From, 0); }
		public TerminalNode StringLiteral() { return getToken(ECMAScriptParser.StringLiteral, 0); }
		public ImportFromContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_importFrom; }
	}

	public final ImportFromContext importFrom() throws RecognitionException {
		ImportFromContext _localctx = new ImportFromContext(_ctx, getState());
		enterRule(_localctx, 20, RULE_importFrom);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(284);
			match(From);
			setState(285);
			match(StringLiteral);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class AliasNameContext extends ParserRuleContext {
		public List<IdentifierNameContext> identifierName() {
			return getRuleContexts(IdentifierNameContext.class);
		}
		public IdentifierNameContext identifierName(int i) {
			return getRuleContext(IdentifierNameContext.class,i);
		}
		public TerminalNode As() { return getToken(ECMAScriptParser.As, 0); }
		public AliasNameContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_aliasName; }
	}

	public final AliasNameContext aliasName() throws RecognitionException {
		AliasNameContext _localctx = new AliasNameContext(_ctx, getState());
		enterRule(_localctx, 22, RULE_aliasName);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(287);
			identifierName();
			setState(290);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==As) {
				{
				setState(288);
				match(As);
				setState(289);
				identifierName();
				}
			}

			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class ExportStatementContext extends ParserRuleContext {
		public ExportStatementContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_exportStatement; }
	 
		public ExportStatementContext() { }
		public void copyFrom(ExportStatementContext ctx) {
			super.copyFrom(ctx);
		}
	}
	public static class ExportDefaultDeclarationContext extends ExportStatementContext {
		public TerminalNode Export() { return getToken(ECMAScriptParser.Export, 0); }
		public TerminalNode Default() { return getToken(ECMAScriptParser.Default, 0); }
		public EosContext eos() {
			return getRuleContext(EosContext.class,0);
		}
		public ClassDeclarationContext classDeclaration() {
			return getRuleContext(ClassDeclarationContext.class,0);
		}
		public FunctionDeclarationContext functionDeclaration() {
			return getRuleContext(FunctionDeclarationContext.class,0);
		}
		public SingleExpressionContext singleExpression() {
			return getRuleContext(SingleExpressionContext.class,0);
		}
		public ExportDefaultDeclarationContext(ExportStatementContext ctx) { copyFrom(ctx); }
	}
	public static class ExportDeclarationContext extends ExportStatementContext {
		public TerminalNode Export() { return getToken(ECMAScriptParser.Export, 0); }
		public EosContext eos() {
			return getRuleContext(EosContext.class,0);
		}
		public ExportFromBlockContext exportFromBlock() {
			return getRuleContext(ExportFromBlockContext.class,0);
		}
		public DeclarationContext declaration() {
			return getRuleContext(DeclarationContext.class,0);
		}
		public ExportDeclarationContext(ExportStatementContext ctx) { copyFrom(ctx); }
	}

	public final ExportStatementContext exportStatement() throws RecognitionException {
		ExportStatementContext _localctx = new ExportStatementContext(_ctx, getState());
		enterRule(_localctx, 24, RULE_exportStatement);
		try {
			setState(308);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,17,_ctx) ) {
			case 1:
				_localctx = new ExportDeclarationContext(_localctx);
				enterOuterAlt(_localctx, 1);
				{
				setState(292);
				match(Export);
				setState(295);
				_errHandler.sync(this);
				switch ( getInterpreter().adaptivePredict(_input,15,_ctx) ) {
				case 1:
					{
					setState(293);
					exportFromBlock();
					}
					break;
				case 2:
					{
					setState(294);
					declaration();
					}
					break;
				}
				setState(297);
				eos();
				}
				break;
			case 2:
				_localctx = new ExportDefaultDeclarationContext(_localctx);
				enterOuterAlt(_localctx, 2);
				{
				setState(299);
				match(Export);
				setState(300);
				match(Default);
				setState(304);
				_errHandler.sync(this);
				switch ( getInterpreter().adaptivePredict(_input,16,_ctx) ) {
				case 1:
					{
					setState(301);
					classDeclaration();
					}
					break;
				case 2:
					{
					setState(302);
					functionDeclaration();
					}
					break;
				case 3:
					{
					setState(303);
					singleExpression(0);
					}
					break;
				}
				setState(306);
				eos();
				}
				break;
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class ExportFromBlockContext extends ParserRuleContext {
		public ImportNamespaceContext importNamespace() {
			return getRuleContext(ImportNamespaceContext.class,0);
		}
		public ImportFromContext importFrom() {
			return getRuleContext(ImportFromContext.class,0);
		}
		public EosContext eos() {
			return getRuleContext(EosContext.class,0);
		}
		public ModuleItemsContext moduleItems() {
			return getRuleContext(ModuleItemsContext.class,0);
		}
		public ExportFromBlockContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_exportFromBlock; }
	}

	public final ExportFromBlockContext exportFromBlock() throws RecognitionException {
		ExportFromBlockContext _localctx = new ExportFromBlockContext(_ctx, getState());
		enterRule(_localctx, 26, RULE_exportFromBlock);
		try {
			setState(320);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case Multiply:
			case NullLiteral:
			case BooleanLiteral:
			case Break:
			case Do:
			case Instanceof:
			case Typeof:
			case Case:
			case Else:
			case New:
			case Var:
			case Catch:
			case Finally:
			case Return:
			case Void:
			case Continue:
			case For:
			case Switch:
			case While:
			case Debugger:
			case Function:
			case This:
			case With:
			case Default:
			case If:
			case Throw:
			case Delete:
			case In:
			case Try:
			case As:
			case From:
			case Let:
			case Class:
			case Enum:
			case Extends:
			case Super:
			case Const:
			case Export:
			case Import:
			case Async:
			case Await:
			case Implements:
			case Private:
			case Public:
			case Interface:
			case Package:
			case Protected:
			case Static:
			case Yield:
			case Identifier:
				enterOuterAlt(_localctx, 1);
				{
				setState(310);
				importNamespace();
				setState(311);
				importFrom();
				setState(312);
				eos();
				}
				break;
			case OpenBrace:
				enterOuterAlt(_localctx, 2);
				{
				setState(314);
				moduleItems();
				setState(316);
				_errHandler.sync(this);
				switch ( getInterpreter().adaptivePredict(_input,18,_ctx) ) {
				case 1:
					{
					setState(315);
					importFrom();
					}
					break;
				}
				setState(318);
				eos();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class DeclarationContext extends ParserRuleContext {
		public VariableStatementContext variableStatement() {
			return getRuleContext(VariableStatementContext.class,0);
		}
		public ClassDeclarationContext classDeclaration() {
			return getRuleContext(ClassDeclarationContext.class,0);
		}
		public FunctionDeclarationContext functionDeclaration() {
			return getRuleContext(FunctionDeclarationContext.class,0);
		}
		public DeclarationContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_declaration; }
	}

	public final DeclarationContext declaration() throws RecognitionException {
		DeclarationContext _localctx = new DeclarationContext(_ctx, getState());
		enterRule(_localctx, 28, RULE_declaration);
		try {
			setState(325);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case Var:
			case Let:
			case Const:
				enterOuterAlt(_localctx, 1);
				{
				setState(322);
				variableStatement();
				}
				break;
			case Class:
				enterOuterAlt(_localctx, 2);
				{
				setState(323);
				classDeclaration();
				}
				break;
			case Function:
			case Async:
				enterOuterAlt(_localctx, 3);
				{
				setState(324);
				functionDeclaration();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class VariableStatementContext extends ParserRuleContext {
		public VariableDeclarationListContext variableDeclarationList() {
			return getRuleContext(VariableDeclarationListContext.class,0);
		}
		public EosContext eos() {
			return getRuleContext(EosContext.class,0);
		}
		public VariableStatementContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_variableStatement; }
	}

	public final VariableStatementContext variableStatement() throws RecognitionException {
		VariableStatementContext _localctx = new VariableStatementContext(_ctx, getState());
		enterRule(_localctx, 30, RULE_variableStatement);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(327);
			variableDeclarationList();
			setState(328);
			eos();
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class VariableDeclarationListContext extends ParserRuleContext {
		public VarModifierContext varModifier() {
			return getRuleContext(VarModifierContext.class,0);
		}
		public List<VariableDeclarationContext> variableDeclaration() {
			return getRuleContexts(VariableDeclarationContext.class);
		}
		public VariableDeclarationContext variableDeclaration(int i) {
			return getRuleContext(VariableDeclarationContext.class,i);
		}
		public List<TerminalNode> Comma() { return getTokens(ECMAScriptParser.Comma); }
		public TerminalNode Comma(int i) {
			return getToken(ECMAScriptParser.Comma, i);
		}
		public VariableDeclarationListContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_variableDeclarationList; }
	}

	public final VariableDeclarationListContext variableDeclarationList() throws RecognitionException {
		VariableDeclarationListContext _localctx = new VariableDeclarationListContext(_ctx, getState());
		enterRule(_localctx, 32, RULE_variableDeclarationList);
		try {
			int _alt;
			enterOuterAlt(_localctx, 1);
			{
			setState(330);
			varModifier();
			setState(331);
			variableDeclaration();
			setState(336);
			_errHandler.sync(this);
			_alt = getInterpreter().adaptivePredict(_input,21,_ctx);
			while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
				if ( _alt==1 ) {
					{
					{
					setState(332);
					match(Comma);
					setState(333);
					variableDeclaration();
					}
					} 
				}
				setState(338);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,21,_ctx);
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class VariableDeclarationContext extends ParserRuleContext {
		public AssignableContext assignable() {
			return getRuleContext(AssignableContext.class,0);
		}
		public TerminalNode Assign() { return getToken(ECMAScriptParser.Assign, 0); }
		public SingleExpressionContext singleExpression() {
			return getRuleContext(SingleExpressionContext.class,0);
		}
		public VariableDeclarationContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_variableDeclaration; }
	}

	public final VariableDeclarationContext variableDeclaration() throws RecognitionException {
		VariableDeclarationContext _localctx = new VariableDeclarationContext(_ctx, getState());
		enterRule(_localctx, 34, RULE_variableDeclaration);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(339);
			assignable();
			setState(342);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,22,_ctx) ) {
			case 1:
				{
				setState(340);
				match(Assign);
				setState(341);
				singleExpression(0);
				}
				break;
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class EmptyStatementContext extends ParserRuleContext {
		public TerminalNode SemiColon() { return getToken(ECMAScriptParser.SemiColon, 0); }
		public EmptyStatementContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_emptyStatement; }
	}

	public final EmptyStatementContext emptyStatement() throws RecognitionException {
		EmptyStatementContext _localctx = new EmptyStatementContext(_ctx, getState());
		enterRule(_localctx, 36, RULE_emptyStatement);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(344);
			match(SemiColon);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class ExpressionStatementContext extends ParserRuleContext {
		public ExpressionSequenceContext expressionSequence() {
			return getRuleContext(ExpressionSequenceContext.class,0);
		}
		public EosContext eos() {
			return getRuleContext(EosContext.class,0);
		}
		public ExpressionStatementContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_expressionStatement; }
	}

	public final ExpressionStatementContext expressionStatement() throws RecognitionException {
		ExpressionStatementContext _localctx = new ExpressionStatementContext(_ctx, getState());
		enterRule(_localctx, 38, RULE_expressionStatement);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(346);
			if (!(this.notOpenBraceAndNotFunction())) throw new FailedPredicateException(this, "this.notOpenBraceAndNotFunction()");
			setState(347);
			expressionSequence();
			setState(348);
			eos();
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class IfStatementContext extends ParserRuleContext {
		public TerminalNode If() { return getToken(ECMAScriptParser.If, 0); }
		public TerminalNode OpenParen() { return getToken(ECMAScriptParser.OpenParen, 0); }
		public ExpressionSequenceContext expressionSequence() {
			return getRuleContext(ExpressionSequenceContext.class,0);
		}
		public TerminalNode CloseParen() { return getToken(ECMAScriptParser.CloseParen, 0); }
		public List<StatementContext> statement() {
			return getRuleContexts(StatementContext.class);
		}
		public StatementContext statement(int i) {
			return getRuleContext(StatementContext.class,i);
		}
		public TerminalNode Else() { return getToken(ECMAScriptParser.Else, 0); }
		public IfStatementContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_ifStatement; }
	}

	public final IfStatementContext ifStatement() throws RecognitionException {
		IfStatementContext _localctx = new IfStatementContext(_ctx, getState());
		enterRule(_localctx, 40, RULE_ifStatement);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(350);
			match(If);
			setState(351);
			match(OpenParen);
			setState(352);
			expressionSequence();
			setState(353);
			match(CloseParen);
			setState(354);
			statement();
			setState(357);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,23,_ctx) ) {
			case 1:
				{
				setState(355);
				match(Else);
				setState(356);
				statement();
				}
				break;
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class IterationStatementContext extends ParserRuleContext {
		public IterationStatementContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_iterationStatement; }
	 
		public IterationStatementContext() { }
		public void copyFrom(IterationStatementContext ctx) {
			super.copyFrom(ctx);
		}
	}
	public static class DoStatementContext extends IterationStatementContext {
		public TerminalNode Do() { return getToken(ECMAScriptParser.Do, 0); }
		public StatementContext statement() {
			return getRuleContext(StatementContext.class,0);
		}
		public TerminalNode While() { return getToken(ECMAScriptParser.While, 0); }
		public TerminalNode OpenParen() { return getToken(ECMAScriptParser.OpenParen, 0); }
		public ExpressionSequenceContext expressionSequence() {
			return getRuleContext(ExpressionSequenceContext.class,0);
		}
		public TerminalNode CloseParen() { return getToken(ECMAScriptParser.CloseParen, 0); }
		public EosContext eos() {
			return getRuleContext(EosContext.class,0);
		}
		public DoStatementContext(IterationStatementContext ctx) { copyFrom(ctx); }
	}
	public static class WhileStatementContext extends IterationStatementContext {
		public TerminalNode While() { return getToken(ECMAScriptParser.While, 0); }
		public TerminalNode OpenParen() { return getToken(ECMAScriptParser.OpenParen, 0); }
		public ExpressionSequenceContext expressionSequence() {
			return getRuleContext(ExpressionSequenceContext.class,0);
		}
		public TerminalNode CloseParen() { return getToken(ECMAScriptParser.CloseParen, 0); }
		public StatementContext statement() {
			return getRuleContext(StatementContext.class,0);
		}
		public WhileStatementContext(IterationStatementContext ctx) { copyFrom(ctx); }
	}
	public static class ForStatementContext extends IterationStatementContext {
		public TerminalNode For() { return getToken(ECMAScriptParser.For, 0); }
		public TerminalNode OpenParen() { return getToken(ECMAScriptParser.OpenParen, 0); }
		public List<TerminalNode> SemiColon() { return getTokens(ECMAScriptParser.SemiColon); }
		public TerminalNode SemiColon(int i) {
			return getToken(ECMAScriptParser.SemiColon, i);
		}
		public TerminalNode CloseParen() { return getToken(ECMAScriptParser.CloseParen, 0); }
		public StatementContext statement() {
			return getRuleContext(StatementContext.class,0);
		}
		public List<ExpressionSequenceContext> expressionSequence() {
			return getRuleContexts(ExpressionSequenceContext.class);
		}
		public ExpressionSequenceContext expressionSequence(int i) {
			return getRuleContext(ExpressionSequenceContext.class,i);
		}
		public VariableDeclarationListContext variableDeclarationList() {
			return getRuleContext(VariableDeclarationListContext.class,0);
		}
		public ForStatementContext(IterationStatementContext ctx) { copyFrom(ctx); }
	}
	public static class ForInStatementContext extends IterationStatementContext {
		public TerminalNode For() { return getToken(ECMAScriptParser.For, 0); }
		public TerminalNode OpenParen() { return getToken(ECMAScriptParser.OpenParen, 0); }
		public TerminalNode In() { return getToken(ECMAScriptParser.In, 0); }
		public ExpressionSequenceContext expressionSequence() {
			return getRuleContext(ExpressionSequenceContext.class,0);
		}
		public TerminalNode CloseParen() { return getToken(ECMAScriptParser.CloseParen, 0); }
		public StatementContext statement() {
			return getRuleContext(StatementContext.class,0);
		}
		public SingleExpressionContext singleExpression() {
			return getRuleContext(SingleExpressionContext.class,0);
		}
		public VariableDeclarationListContext variableDeclarationList() {
			return getRuleContext(VariableDeclarationListContext.class,0);
		}
		public ForInStatementContext(IterationStatementContext ctx) { copyFrom(ctx); }
	}
	public static class ForOfStatementContext extends IterationStatementContext {
		public TerminalNode For() { return getToken(ECMAScriptParser.For, 0); }
		public TerminalNode OpenParen() { return getToken(ECMAScriptParser.OpenParen, 0); }
		public IdentifierContext identifier() {
			return getRuleContext(IdentifierContext.class,0);
		}
		public ExpressionSequenceContext expressionSequence() {
			return getRuleContext(ExpressionSequenceContext.class,0);
		}
		public TerminalNode CloseParen() { return getToken(ECMAScriptParser.CloseParen, 0); }
		public StatementContext statement() {
			return getRuleContext(StatementContext.class,0);
		}
		public SingleExpressionContext singleExpression() {
			return getRuleContext(SingleExpressionContext.class,0);
		}
		public VariableDeclarationListContext variableDeclarationList() {
			return getRuleContext(VariableDeclarationListContext.class,0);
		}
		public TerminalNode Await() { return getToken(ECMAScriptParser.Await, 0); }
		public ForOfStatementContext(IterationStatementContext ctx) { copyFrom(ctx); }
	}

	public final IterationStatementContext iterationStatement() throws RecognitionException {
		IterationStatementContext _localctx = new IterationStatementContext(_ctx, getState());
		enterRule(_localctx, 42, RULE_iterationStatement);
		int _la;
		try {
			setState(415);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,30,_ctx) ) {
			case 1:
				_localctx = new DoStatementContext(_localctx);
				enterOuterAlt(_localctx, 1);
				{
				setState(359);
				match(Do);
				setState(360);
				statement();
				setState(361);
				match(While);
				setState(362);
				match(OpenParen);
				setState(363);
				expressionSequence();
				setState(364);
				match(CloseParen);
				setState(365);
				eos();
				}
				break;
			case 2:
				_localctx = new WhileStatementContext(_localctx);
				enterOuterAlt(_localctx, 2);
				{
				setState(367);
				match(While);
				setState(368);
				match(OpenParen);
				setState(369);
				expressionSequence();
				setState(370);
				match(CloseParen);
				setState(371);
				statement();
				}
				break;
			case 3:
				_localctx = new ForStatementContext(_localctx);
				enterOuterAlt(_localctx, 3);
				{
				setState(373);
				match(For);
				setState(374);
				match(OpenParen);
				setState(377);
				_errHandler.sync(this);
				switch (_input.LA(1)) {
				case RegularExpressionLiteral:
				case OpenBracket:
				case OpenParen:
				case OpenBrace:
				case PlusPlus:
				case MinusMinus:
				case Plus:
				case Minus:
				case BitNot:
				case Not:
				case NullLiteral:
				case BooleanLiteral:
				case DecimalLiteral:
				case HexIntegerLiteral:
				case OctalIntegerLiteral:
				case OctalIntegerLiteral2:
				case BinaryIntegerLiteral:
				case BigHexIntegerLiteral:
				case BigOctalIntegerLiteral:
				case BigBinaryIntegerLiteral:
				case BigDecimalIntegerLiteral:
				case Typeof:
				case New:
				case Void:
				case Function:
				case This:
				case Delete:
				case Class:
				case Super:
				case Import:
				case Async:
				case Await:
				case Select:
				case Using:
				case NonStrictLet:
				case Yield:
				case Identifier:
				case StringLiteral:
				case TemplateStringLiteral:
					{
					setState(375);
					expressionSequence();
					}
					break;
				case Var:
				case Let:
				case Const:
					{
					setState(376);
					variableDeclarationList();
					}
					break;
				case SemiColon:
					break;
				default:
					break;
				}
				setState(379);
				match(SemiColon);
				setState(381);
				_errHandler.sync(this);
				_la = _input.LA(1);
				if (((((_la - 4)) & ~0x3f) == 0 && ((1L << (_la - 4)) & ((1L << (RegularExpressionLiteral - 4)) | (1L << (OpenBracket - 4)) | (1L << (OpenParen - 4)) | (1L << (OpenBrace - 4)) | (1L << (PlusPlus - 4)) | (1L << (MinusMinus - 4)) | (1L << (Plus - 4)) | (1L << (Minus - 4)) | (1L << (BitNot - 4)) | (1L << (Not - 4)) | (1L << (NullLiteral - 4)) | (1L << (BooleanLiteral - 4)) | (1L << (DecimalLiteral - 4)) | (1L << (HexIntegerLiteral - 4)) | (1L << (OctalIntegerLiteral - 4)) | (1L << (OctalIntegerLiteral2 - 4)) | (1L << (BinaryIntegerLiteral - 4)) | (1L << (BigHexIntegerLiteral - 4)) | (1L << (BigOctalIntegerLiteral - 4)))) != 0) || ((((_la - 68)) & ~0x3f) == 0 && ((1L << (_la - 68)) & ((1L << (BigBinaryIntegerLiteral - 68)) | (1L << (BigDecimalIntegerLiteral - 68)) | (1L << (Typeof - 68)) | (1L << (New - 68)) | (1L << (Void - 68)) | (1L << (Function - 68)) | (1L << (This - 68)) | (1L << (Delete - 68)) | (1L << (Class - 68)) | (1L << (Super - 68)) | (1L << (Import - 68)) | (1L << (Async - 68)) | (1L << (Await - 68)) | (1L << (Select - 68)) | (1L << (Using - 68)) | (1L << (NonStrictLet - 68)) | (1L << (Yield - 68)) | (1L << (Identifier - 68)) | (1L << (StringLiteral - 68)) | (1L << (TemplateStringLiteral - 68)))) != 0)) {
					{
					setState(380);
					expressionSequence();
					}
				}

				setState(383);
				match(SemiColon);
				setState(385);
				_errHandler.sync(this);
				_la = _input.LA(1);
				if (((((_la - 4)) & ~0x3f) == 0 && ((1L << (_la - 4)) & ((1L << (RegularExpressionLiteral - 4)) | (1L << (OpenBracket - 4)) | (1L << (OpenParen - 4)) | (1L << (OpenBrace - 4)) | (1L << (PlusPlus - 4)) | (1L << (MinusMinus - 4)) | (1L << (Plus - 4)) | (1L << (Minus - 4)) | (1L << (BitNot - 4)) | (1L << (Not - 4)) | (1L << (NullLiteral - 4)) | (1L << (BooleanLiteral - 4)) | (1L << (DecimalLiteral - 4)) | (1L << (HexIntegerLiteral - 4)) | (1L << (OctalIntegerLiteral - 4)) | (1L << (OctalIntegerLiteral2 - 4)) | (1L << (BinaryIntegerLiteral - 4)) | (1L << (BigHexIntegerLiteral - 4)) | (1L << (BigOctalIntegerLiteral - 4)))) != 0) || ((((_la - 68)) & ~0x3f) == 0 && ((1L << (_la - 68)) & ((1L << (BigBinaryIntegerLiteral - 68)) | (1L << (BigDecimalIntegerLiteral - 68)) | (1L << (Typeof - 68)) | (1L << (New - 68)) | (1L << (Void - 68)) | (1L << (Function - 68)) | (1L << (This - 68)) | (1L << (Delete - 68)) | (1L << (Class - 68)) | (1L << (Super - 68)) | (1L << (Import - 68)) | (1L << (Async - 68)) | (1L << (Await - 68)) | (1L << (Select - 68)) | (1L << (Using - 68)) | (1L << (NonStrictLet - 68)) | (1L << (Yield - 68)) | (1L << (Identifier - 68)) | (1L << (StringLiteral - 68)) | (1L << (TemplateStringLiteral - 68)))) != 0)) {
					{
					setState(384);
					expressionSequence();
					}
				}

				setState(387);
				match(CloseParen);
				setState(388);
				statement();
				}
				break;
			case 4:
				_localctx = new ForInStatementContext(_localctx);
				enterOuterAlt(_localctx, 4);
				{
				setState(389);
				match(For);
				setState(390);
				match(OpenParen);
				setState(393);
				_errHandler.sync(this);
				switch (_input.LA(1)) {
				case RegularExpressionLiteral:
				case OpenBracket:
				case OpenParen:
				case OpenBrace:
				case PlusPlus:
				case MinusMinus:
				case Plus:
				case Minus:
				case BitNot:
				case Not:
				case NullLiteral:
				case BooleanLiteral:
				case DecimalLiteral:
				case HexIntegerLiteral:
				case OctalIntegerLiteral:
				case OctalIntegerLiteral2:
				case BinaryIntegerLiteral:
				case BigHexIntegerLiteral:
				case BigOctalIntegerLiteral:
				case BigBinaryIntegerLiteral:
				case BigDecimalIntegerLiteral:
				case Typeof:
				case New:
				case Void:
				case Function:
				case This:
				case Delete:
				case Class:
				case Super:
				case Import:
				case Async:
				case Await:
				case Select:
				case Using:
				case NonStrictLet:
				case Yield:
				case Identifier:
				case StringLiteral:
				case TemplateStringLiteral:
					{
					setState(391);
					singleExpression(0);
					}
					break;
				case Var:
				case Let:
				case Const:
					{
					setState(392);
					variableDeclarationList();
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				setState(395);
				match(In);
				setState(396);
				expressionSequence();
				setState(397);
				match(CloseParen);
				setState(398);
				statement();
				}
				break;
			case 5:
				_localctx = new ForOfStatementContext(_localctx);
				enterOuterAlt(_localctx, 5);
				{
				setState(400);
				match(For);
				setState(402);
				_errHandler.sync(this);
				_la = _input.LA(1);
				if (_la==Await) {
					{
					setState(401);
					match(Await);
					}
				}

				setState(404);
				match(OpenParen);
				setState(407);
				_errHandler.sync(this);
				switch (_input.LA(1)) {
				case RegularExpressionLiteral:
				case OpenBracket:
				case OpenParen:
				case OpenBrace:
				case PlusPlus:
				case MinusMinus:
				case Plus:
				case Minus:
				case BitNot:
				case Not:
				case NullLiteral:
				case BooleanLiteral:
				case DecimalLiteral:
				case HexIntegerLiteral:
				case OctalIntegerLiteral:
				case OctalIntegerLiteral2:
				case BinaryIntegerLiteral:
				case BigHexIntegerLiteral:
				case BigOctalIntegerLiteral:
				case BigBinaryIntegerLiteral:
				case BigDecimalIntegerLiteral:
				case Typeof:
				case New:
				case Void:
				case Function:
				case This:
				case Delete:
				case Class:
				case Super:
				case Import:
				case Async:
				case Await:
				case Select:
				case Using:
				case NonStrictLet:
				case Yield:
				case Identifier:
				case StringLiteral:
				case TemplateStringLiteral:
					{
					setState(405);
					singleExpression(0);
					}
					break;
				case Var:
				case Let:
				case Const:
					{
					setState(406);
					variableDeclarationList();
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				setState(409);
				identifier();
				setState(410);
				if (!(this.p("of"))) throw new FailedPredicateException(this, "this.p(\"of\")");
				setState(411);
				expressionSequence();
				setState(412);
				match(CloseParen);
				setState(413);
				statement();
				}
				break;
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class VarModifierContext extends ParserRuleContext {
		public TerminalNode Var() { return getToken(ECMAScriptParser.Var, 0); }
		public TerminalNode Let() { return getToken(ECMAScriptParser.Let, 0); }
		public TerminalNode Const() { return getToken(ECMAScriptParser.Const, 0); }
		public VarModifierContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_varModifier; }
	}

	public final VarModifierContext varModifier() throws RecognitionException {
		VarModifierContext _localctx = new VarModifierContext(_ctx, getState());
		enterRule(_localctx, 44, RULE_varModifier);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(417);
			_la = _input.LA(1);
			if ( !(((((_la - 77)) & ~0x3f) == 0 && ((1L << (_la - 77)) & ((1L << (Var - 77)) | (1L << (Let - 77)) | (1L << (Const - 77)))) != 0)) ) {
			_errHandler.recoverInline(this);
			}
			else {
				if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
				_errHandler.reportMatch(this);
				consume();
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class ContinueStatementContext extends ParserRuleContext {
		public TerminalNode Continue() { return getToken(ECMAScriptParser.Continue, 0); }
		public EosContext eos() {
			return getRuleContext(EosContext.class,0);
		}
		public IdentifierContext identifier() {
			return getRuleContext(IdentifierContext.class,0);
		}
		public ContinueStatementContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_continueStatement; }
	}

	public final ContinueStatementContext continueStatement() throws RecognitionException {
		ContinueStatementContext _localctx = new ContinueStatementContext(_ctx, getState());
		enterRule(_localctx, 46, RULE_continueStatement);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(419);
			match(Continue);
			setState(422);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,31,_ctx) ) {
			case 1:
				{
				setState(420);
				if (!(this.notLineTerminator())) throw new FailedPredicateException(this, "this.notLineTerminator()");
				setState(421);
				identifier();
				}
				break;
			}
			setState(424);
			eos();
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class BreakStatementContext extends ParserRuleContext {
		public TerminalNode Break() { return getToken(ECMAScriptParser.Break, 0); }
		public EosContext eos() {
			return getRuleContext(EosContext.class,0);
		}
		public IdentifierContext identifier() {
			return getRuleContext(IdentifierContext.class,0);
		}
		public BreakStatementContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_breakStatement; }
	}

	public final BreakStatementContext breakStatement() throws RecognitionException {
		BreakStatementContext _localctx = new BreakStatementContext(_ctx, getState());
		enterRule(_localctx, 48, RULE_breakStatement);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(426);
			match(Break);
			setState(429);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,32,_ctx) ) {
			case 1:
				{
				setState(427);
				if (!(this.notLineTerminator())) throw new FailedPredicateException(this, "this.notLineTerminator()");
				setState(428);
				identifier();
				}
				break;
			}
			setState(431);
			eos();
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class ReturnStatementContext extends ParserRuleContext {
		public TerminalNode Return() { return getToken(ECMAScriptParser.Return, 0); }
		public EosContext eos() {
			return getRuleContext(EosContext.class,0);
		}
		public ExpressionSequenceContext expressionSequence() {
			return getRuleContext(ExpressionSequenceContext.class,0);
		}
		public ReturnStatementContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_returnStatement; }
	}

	public final ReturnStatementContext returnStatement() throws RecognitionException {
		ReturnStatementContext _localctx = new ReturnStatementContext(_ctx, getState());
		enterRule(_localctx, 50, RULE_returnStatement);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(433);
			match(Return);
			setState(436);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,33,_ctx) ) {
			case 1:
				{
				setState(434);
				if (!(this.notLineTerminator())) throw new FailedPredicateException(this, "this.notLineTerminator()");
				setState(435);
				expressionSequence();
				}
				break;
			}
			setState(438);
			eos();
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class WithStatementContext extends ParserRuleContext {
		public TerminalNode With() { return getToken(ECMAScriptParser.With, 0); }
		public TerminalNode OpenParen() { return getToken(ECMAScriptParser.OpenParen, 0); }
		public ExpressionSequenceContext expressionSequence() {
			return getRuleContext(ExpressionSequenceContext.class,0);
		}
		public TerminalNode CloseParen() { return getToken(ECMAScriptParser.CloseParen, 0); }
		public StatementContext statement() {
			return getRuleContext(StatementContext.class,0);
		}
		public WithStatementContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_withStatement; }
	}

	public final WithStatementContext withStatement() throws RecognitionException {
		WithStatementContext _localctx = new WithStatementContext(_ctx, getState());
		enterRule(_localctx, 52, RULE_withStatement);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(440);
			match(With);
			setState(441);
			match(OpenParen);
			setState(442);
			expressionSequence();
			setState(443);
			match(CloseParen);
			setState(444);
			statement();
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class SwitchStatementContext extends ParserRuleContext {
		public TerminalNode Switch() { return getToken(ECMAScriptParser.Switch, 0); }
		public TerminalNode OpenParen() { return getToken(ECMAScriptParser.OpenParen, 0); }
		public ExpressionSequenceContext expressionSequence() {
			return getRuleContext(ExpressionSequenceContext.class,0);
		}
		public TerminalNode CloseParen() { return getToken(ECMAScriptParser.CloseParen, 0); }
		public CaseBlockContext caseBlock() {
			return getRuleContext(CaseBlockContext.class,0);
		}
		public SwitchStatementContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_switchStatement; }
	}

	public final SwitchStatementContext switchStatement() throws RecognitionException {
		SwitchStatementContext _localctx = new SwitchStatementContext(_ctx, getState());
		enterRule(_localctx, 54, RULE_switchStatement);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(446);
			match(Switch);
			setState(447);
			match(OpenParen);
			setState(448);
			expressionSequence();
			setState(449);
			match(CloseParen);
			setState(450);
			caseBlock();
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class CaseBlockContext extends ParserRuleContext {
		public TerminalNode OpenBrace() { return getToken(ECMAScriptParser.OpenBrace, 0); }
		public TerminalNode CloseBrace() { return getToken(ECMAScriptParser.CloseBrace, 0); }
		public List<CaseClausesContext> caseClauses() {
			return getRuleContexts(CaseClausesContext.class);
		}
		public CaseClausesContext caseClauses(int i) {
			return getRuleContext(CaseClausesContext.class,i);
		}
		public DefaultClauseContext defaultClause() {
			return getRuleContext(DefaultClauseContext.class,0);
		}
		public CaseBlockContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_caseBlock; }
	}

	public final CaseBlockContext caseBlock() throws RecognitionException {
		CaseBlockContext _localctx = new CaseBlockContext(_ctx, getState());
		enterRule(_localctx, 56, RULE_caseBlock);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(452);
			match(OpenBrace);
			setState(454);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==Case) {
				{
				setState(453);
				caseClauses();
				}
			}

			setState(460);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==Default) {
				{
				setState(456);
				defaultClause();
				setState(458);
				_errHandler.sync(this);
				_la = _input.LA(1);
				if (_la==Case) {
					{
					setState(457);
					caseClauses();
					}
				}

				}
			}

			setState(462);
			match(CloseBrace);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class CaseClausesContext extends ParserRuleContext {
		public List<CaseClauseContext> caseClause() {
			return getRuleContexts(CaseClauseContext.class);
		}
		public CaseClauseContext caseClause(int i) {
			return getRuleContext(CaseClauseContext.class,i);
		}
		public CaseClausesContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_caseClauses; }
	}

	public final CaseClausesContext caseClauses() throws RecognitionException {
		CaseClausesContext _localctx = new CaseClausesContext(_ctx, getState());
		enterRule(_localctx, 58, RULE_caseClauses);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(465); 
			_errHandler.sync(this);
			_la = _input.LA(1);
			do {
				{
				{
				setState(464);
				caseClause();
				}
				}
				setState(467); 
				_errHandler.sync(this);
				_la = _input.LA(1);
			} while ( _la==Case );
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class CaseClauseContext extends ParserRuleContext {
		public TerminalNode Case() { return getToken(ECMAScriptParser.Case, 0); }
		public ExpressionSequenceContext expressionSequence() {
			return getRuleContext(ExpressionSequenceContext.class,0);
		}
		public TerminalNode Colon() { return getToken(ECMAScriptParser.Colon, 0); }
		public StatementListContext statementList() {
			return getRuleContext(StatementListContext.class,0);
		}
		public CaseClauseContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_caseClause; }
	}

	public final CaseClauseContext caseClause() throws RecognitionException {
		CaseClauseContext _localctx = new CaseClauseContext(_ctx, getState());
		enterRule(_localctx, 60, RULE_caseClause);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(469);
			match(Case);
			setState(470);
			expressionSequence();
			setState(471);
			match(Colon);
			setState(473);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,38,_ctx) ) {
			case 1:
				{
				setState(472);
				statementList();
				}
				break;
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class DefaultClauseContext extends ParserRuleContext {
		public TerminalNode Default() { return getToken(ECMAScriptParser.Default, 0); }
		public TerminalNode Colon() { return getToken(ECMAScriptParser.Colon, 0); }
		public StatementListContext statementList() {
			return getRuleContext(StatementListContext.class,0);
		}
		public DefaultClauseContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_defaultClause; }
	}

	public final DefaultClauseContext defaultClause() throws RecognitionException {
		DefaultClauseContext _localctx = new DefaultClauseContext(_ctx, getState());
		enterRule(_localctx, 62, RULE_defaultClause);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(475);
			match(Default);
			setState(476);
			match(Colon);
			setState(478);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,39,_ctx) ) {
			case 1:
				{
				setState(477);
				statementList();
				}
				break;
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class LabelledStatementContext extends ParserRuleContext {
		public IdentifierContext identifier() {
			return getRuleContext(IdentifierContext.class,0);
		}
		public TerminalNode Colon() { return getToken(ECMAScriptParser.Colon, 0); }
		public StatementContext statement() {
			return getRuleContext(StatementContext.class,0);
		}
		public LabelledStatementContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_labelledStatement; }
	}

	public final LabelledStatementContext labelledStatement() throws RecognitionException {
		LabelledStatementContext _localctx = new LabelledStatementContext(_ctx, getState());
		enterRule(_localctx, 64, RULE_labelledStatement);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(480);
			identifier();
			setState(481);
			match(Colon);
			setState(482);
			statement();
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class ThrowStatementContext extends ParserRuleContext {
		public TerminalNode Throw() { return getToken(ECMAScriptParser.Throw, 0); }
		public ExpressionSequenceContext expressionSequence() {
			return getRuleContext(ExpressionSequenceContext.class,0);
		}
		public EosContext eos() {
			return getRuleContext(EosContext.class,0);
		}
		public ThrowStatementContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_throwStatement; }
	}

	public final ThrowStatementContext throwStatement() throws RecognitionException {
		ThrowStatementContext _localctx = new ThrowStatementContext(_ctx, getState());
		enterRule(_localctx, 66, RULE_throwStatement);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(484);
			match(Throw);
			setState(485);
			if (!(this.notLineTerminator())) throw new FailedPredicateException(this, "this.notLineTerminator()");
			setState(486);
			expressionSequence();
			setState(487);
			eos();
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class TryStatementContext extends ParserRuleContext {
		public TerminalNode Try() { return getToken(ECMAScriptParser.Try, 0); }
		public BlockContext block() {
			return getRuleContext(BlockContext.class,0);
		}
		public CatchProductionContext catchProduction() {
			return getRuleContext(CatchProductionContext.class,0);
		}
		public FinallyProductionContext finallyProduction() {
			return getRuleContext(FinallyProductionContext.class,0);
		}
		public TryStatementContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_tryStatement; }
	}

	public final TryStatementContext tryStatement() throws RecognitionException {
		TryStatementContext _localctx = new TryStatementContext(_ctx, getState());
		enterRule(_localctx, 68, RULE_tryStatement);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(489);
			match(Try);
			setState(490);
			block();
			setState(496);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case Catch:
				{
				setState(491);
				catchProduction();
				setState(493);
				_errHandler.sync(this);
				switch ( getInterpreter().adaptivePredict(_input,40,_ctx) ) {
				case 1:
					{
					setState(492);
					finallyProduction();
					}
					break;
				}
				}
				break;
			case Finally:
				{
				setState(495);
				finallyProduction();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class CatchProductionContext extends ParserRuleContext {
		public TerminalNode Catch() { return getToken(ECMAScriptParser.Catch, 0); }
		public BlockContext block() {
			return getRuleContext(BlockContext.class,0);
		}
		public TerminalNode OpenParen() { return getToken(ECMAScriptParser.OpenParen, 0); }
		public TerminalNode CloseParen() { return getToken(ECMAScriptParser.CloseParen, 0); }
		public AssignableContext assignable() {
			return getRuleContext(AssignableContext.class,0);
		}
		public CatchProductionContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_catchProduction; }
	}

	public final CatchProductionContext catchProduction() throws RecognitionException {
		CatchProductionContext _localctx = new CatchProductionContext(_ctx, getState());
		enterRule(_localctx, 70, RULE_catchProduction);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(498);
			match(Catch);
			setState(504);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==OpenParen) {
				{
				setState(499);
				match(OpenParen);
				setState(501);
				_errHandler.sync(this);
				_la = _input.LA(1);
				if (_la==OpenBracket || _la==OpenBrace || ((((_la - 106)) & ~0x3f) == 0 && ((1L << (_la - 106)) & ((1L << (Async - 106)) | (1L << (NonStrictLet - 106)) | (1L << (Identifier - 106)))) != 0)) {
					{
					setState(500);
					assignable();
					}
				}

				setState(503);
				match(CloseParen);
				}
			}

			setState(506);
			block();
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class FinallyProductionContext extends ParserRuleContext {
		public TerminalNode Finally() { return getToken(ECMAScriptParser.Finally, 0); }
		public BlockContext block() {
			return getRuleContext(BlockContext.class,0);
		}
		public FinallyProductionContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_finallyProduction; }
	}

	public final FinallyProductionContext finallyProduction() throws RecognitionException {
		FinallyProductionContext _localctx = new FinallyProductionContext(_ctx, getState());
		enterRule(_localctx, 72, RULE_finallyProduction);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(508);
			match(Finally);
			setState(509);
			block();
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class DebuggerStatementContext extends ParserRuleContext {
		public TerminalNode Debugger() { return getToken(ECMAScriptParser.Debugger, 0); }
		public EosContext eos() {
			return getRuleContext(EosContext.class,0);
		}
		public DebuggerStatementContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_debuggerStatement; }
	}

	public final DebuggerStatementContext debuggerStatement() throws RecognitionException {
		DebuggerStatementContext _localctx = new DebuggerStatementContext(_ctx, getState());
		enterRule(_localctx, 74, RULE_debuggerStatement);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(511);
			match(Debugger);
			setState(512);
			eos();
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class FunctionDeclarationContext extends ParserRuleContext {
		public TerminalNode Function() { return getToken(ECMAScriptParser.Function, 0); }
		public IdentifierContext identifier() {
			return getRuleContext(IdentifierContext.class,0);
		}
		public TerminalNode OpenParen() { return getToken(ECMAScriptParser.OpenParen, 0); }
		public TerminalNode CloseParen() { return getToken(ECMAScriptParser.CloseParen, 0); }
		public TerminalNode OpenBrace() { return getToken(ECMAScriptParser.OpenBrace, 0); }
		public FunctionBodyContext functionBody() {
			return getRuleContext(FunctionBodyContext.class,0);
		}
		public TerminalNode CloseBrace() { return getToken(ECMAScriptParser.CloseBrace, 0); }
		public TerminalNode Async() { return getToken(ECMAScriptParser.Async, 0); }
		public TerminalNode Multiply() { return getToken(ECMAScriptParser.Multiply, 0); }
		public FormalParameterListContext formalParameterList() {
			return getRuleContext(FormalParameterListContext.class,0);
		}
		public FunctionDeclarationContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_functionDeclaration; }
	}

	public final FunctionDeclarationContext functionDeclaration() throws RecognitionException {
		FunctionDeclarationContext _localctx = new FunctionDeclarationContext(_ctx, getState());
		enterRule(_localctx, 76, RULE_functionDeclaration);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(515);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==Async) {
				{
				setState(514);
				match(Async);
				}
			}

			setState(517);
			match(Function);
			setState(519);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==Multiply) {
				{
				setState(518);
				match(Multiply);
				}
			}

			setState(521);
			identifier();
			setState(522);
			match(OpenParen);
			setState(524);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if ((((_la) & ~0x3f) == 0 && ((1L << _la) & ((1L << OpenBracket) | (1L << OpenBrace) | (1L << Ellipsis))) != 0) || ((((_la - 106)) & ~0x3f) == 0 && ((1L << (_la - 106)) & ((1L << (Async - 106)) | (1L << (NonStrictLet - 106)) | (1L << (Identifier - 106)))) != 0)) {
				{
				setState(523);
				formalParameterList();
				}
			}

			setState(526);
			match(CloseParen);
			setState(527);
			match(OpenBrace);
			setState(528);
			functionBody();
			setState(529);
			match(CloseBrace);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class ClassDeclarationContext extends ParserRuleContext {
		public TerminalNode Class() { return getToken(ECMAScriptParser.Class, 0); }
		public IdentifierContext identifier() {
			return getRuleContext(IdentifierContext.class,0);
		}
		public ClassTailContext classTail() {
			return getRuleContext(ClassTailContext.class,0);
		}
		public ClassDeclarationContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_classDeclaration; }
	}

	public final ClassDeclarationContext classDeclaration() throws RecognitionException {
		ClassDeclarationContext _localctx = new ClassDeclarationContext(_ctx, getState());
		enterRule(_localctx, 78, RULE_classDeclaration);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(531);
			match(Class);
			setState(532);
			identifier();
			setState(533);
			classTail();
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class ClassTailContext extends ParserRuleContext {
		public TerminalNode OpenBrace() { return getToken(ECMAScriptParser.OpenBrace, 0); }
		public TerminalNode CloseBrace() { return getToken(ECMAScriptParser.CloseBrace, 0); }
		public ClassHeritageContext classHeritage() {
			return getRuleContext(ClassHeritageContext.class,0);
		}
		public List<ClassElementContext> classElement() {
			return getRuleContexts(ClassElementContext.class);
		}
		public ClassElementContext classElement(int i) {
			return getRuleContext(ClassElementContext.class,i);
		}
		public ClassTailContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_classTail; }
	}

	public final ClassTailContext classTail() throws RecognitionException {
		ClassTailContext _localctx = new ClassTailContext(_ctx, getState());
		enterRule(_localctx, 80, RULE_classTail);
		int _la;
		try {
			int _alt;
			enterOuterAlt(_localctx, 1);
			{
			setState(536);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==Extends) {
				{
				setState(535);
				classHeritage();
				}
			}

			setState(538);
			match(OpenBrace);
			setState(542);
			_errHandler.sync(this);
			_alt = getInterpreter().adaptivePredict(_input,48,_ctx);
			while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
				if ( _alt==1 ) {
					{
					{
					setState(539);
					classElement();
					}
					} 
				}
				setState(544);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,48,_ctx);
			}
			setState(545);
			match(CloseBrace);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class ClassHeritageContext extends ParserRuleContext {
		public TerminalNode Extends() { return getToken(ECMAScriptParser.Extends, 0); }
		public SingleExpressionContext singleExpression() {
			return getRuleContext(SingleExpressionContext.class,0);
		}
		public ClassHeritageContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_classHeritage; }
	}

	public final ClassHeritageContext classHeritage() throws RecognitionException {
		ClassHeritageContext _localctx = new ClassHeritageContext(_ctx, getState());
		enterRule(_localctx, 82, RULE_classHeritage);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(547);
			match(Extends);
			setState(548);
			singleExpression(0);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class ClassElementContext extends ParserRuleContext {
		public MethodDefinitionContext methodDefinition() {
			return getRuleContext(MethodDefinitionContext.class,0);
		}
		public List<TerminalNode> Static() { return getTokens(ECMAScriptParser.Static); }
		public TerminalNode Static(int i) {
			return getToken(ECMAScriptParser.Static, i);
		}
		public List<IdentifierContext> identifier() {
			return getRuleContexts(IdentifierContext.class);
		}
		public IdentifierContext identifier(int i) {
			return getRuleContext(IdentifierContext.class,i);
		}
		public List<TerminalNode> Async() { return getTokens(ECMAScriptParser.Async); }
		public TerminalNode Async(int i) {
			return getToken(ECMAScriptParser.Async, i);
		}
		public EmptyStatementContext emptyStatement() {
			return getRuleContext(EmptyStatementContext.class,0);
		}
		public PropertyNameContext propertyName() {
			return getRuleContext(PropertyNameContext.class,0);
		}
		public TerminalNode Assign() { return getToken(ECMAScriptParser.Assign, 0); }
		public SingleExpressionContext singleExpression() {
			return getRuleContext(SingleExpressionContext.class,0);
		}
		public TerminalNode Hashtag() { return getToken(ECMAScriptParser.Hashtag, 0); }
		public ClassElementContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_classElement; }
	}

	public final ClassElementContext classElement() throws RecognitionException {
		ClassElementContext _localctx = new ClassElementContext(_ctx, getState());
		enterRule(_localctx, 84, RULE_classElement);
		int _la;
		try {
			int _alt;
			setState(568);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,52,_ctx) ) {
			case 1:
				enterOuterAlt(_localctx, 1);
				{
				setState(556);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,50,_ctx);
				while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
					if ( _alt==1 ) {
						{
						setState(554);
						_errHandler.sync(this);
						switch ( getInterpreter().adaptivePredict(_input,49,_ctx) ) {
						case 1:
							{
							setState(550);
							match(Static);
							}
							break;
						case 2:
							{
							setState(551);
							if (!(this.n("static"))) throw new FailedPredicateException(this, "this.n(\"static\")");
							setState(552);
							identifier();
							}
							break;
						case 3:
							{
							setState(553);
							match(Async);
							}
							break;
						}
						} 
					}
					setState(558);
					_errHandler.sync(this);
					_alt = getInterpreter().adaptivePredict(_input,50,_ctx);
				}
				setState(559);
				methodDefinition();
				}
				break;
			case 2:
				enterOuterAlt(_localctx, 2);
				{
				setState(560);
				emptyStatement();
				}
				break;
			case 3:
				enterOuterAlt(_localctx, 3);
				{
				setState(562);
				_errHandler.sync(this);
				_la = _input.LA(1);
				if (_la==Hashtag) {
					{
					setState(561);
					match(Hashtag);
					}
				}

				setState(564);
				propertyName();
				setState(565);
				match(Assign);
				setState(566);
				singleExpression(0);
				}
				break;
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class MethodDefinitionContext extends ParserRuleContext {
		public PropertyNameContext propertyName() {
			return getRuleContext(PropertyNameContext.class,0);
		}
		public TerminalNode OpenParen() { return getToken(ECMAScriptParser.OpenParen, 0); }
		public TerminalNode CloseParen() { return getToken(ECMAScriptParser.CloseParen, 0); }
		public TerminalNode OpenBrace() { return getToken(ECMAScriptParser.OpenBrace, 0); }
		public FunctionBodyContext functionBody() {
			return getRuleContext(FunctionBodyContext.class,0);
		}
		public TerminalNode CloseBrace() { return getToken(ECMAScriptParser.CloseBrace, 0); }
		public TerminalNode Multiply() { return getToken(ECMAScriptParser.Multiply, 0); }
		public TerminalNode Hashtag() { return getToken(ECMAScriptParser.Hashtag, 0); }
		public FormalParameterListContext formalParameterList() {
			return getRuleContext(FormalParameterListContext.class,0);
		}
		public GetterContext getter() {
			return getRuleContext(GetterContext.class,0);
		}
		public SetterContext setter() {
			return getRuleContext(SetterContext.class,0);
		}
		public MethodDefinitionContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_methodDefinition; }
	}

	public final MethodDefinitionContext methodDefinition() throws RecognitionException {
		MethodDefinitionContext _localctx = new MethodDefinitionContext(_ctx, getState());
		enterRule(_localctx, 86, RULE_methodDefinition);
		int _la;
		try {
			setState(615);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,61,_ctx) ) {
			case 1:
				enterOuterAlt(_localctx, 1);
				{
				setState(571);
				_errHandler.sync(this);
				_la = _input.LA(1);
				if (_la==Multiply) {
					{
					setState(570);
					match(Multiply);
					}
				}

				setState(574);
				_errHandler.sync(this);
				_la = _input.LA(1);
				if (_la==Hashtag) {
					{
					setState(573);
					match(Hashtag);
					}
				}

				setState(576);
				propertyName();
				setState(577);
				match(OpenParen);
				setState(579);
				_errHandler.sync(this);
				_la = _input.LA(1);
				if ((((_la) & ~0x3f) == 0 && ((1L << _la) & ((1L << OpenBracket) | (1L << OpenBrace) | (1L << Ellipsis))) != 0) || ((((_la - 106)) & ~0x3f) == 0 && ((1L << (_la - 106)) & ((1L << (Async - 106)) | (1L << (NonStrictLet - 106)) | (1L << (Identifier - 106)))) != 0)) {
					{
					setState(578);
					formalParameterList();
					}
				}

				setState(581);
				match(CloseParen);
				setState(582);
				match(OpenBrace);
				setState(583);
				functionBody();
				setState(584);
				match(CloseBrace);
				}
				break;
			case 2:
				enterOuterAlt(_localctx, 2);
				{
				setState(587);
				_errHandler.sync(this);
				switch ( getInterpreter().adaptivePredict(_input,56,_ctx) ) {
				case 1:
					{
					setState(586);
					match(Multiply);
					}
					break;
				}
				setState(590);
				_errHandler.sync(this);
				switch ( getInterpreter().adaptivePredict(_input,57,_ctx) ) {
				case 1:
					{
					setState(589);
					match(Hashtag);
					}
					break;
				}
				setState(592);
				getter();
				setState(593);
				match(OpenParen);
				setState(594);
				match(CloseParen);
				setState(595);
				match(OpenBrace);
				setState(596);
				functionBody();
				setState(597);
				match(CloseBrace);
				}
				break;
			case 3:
				enterOuterAlt(_localctx, 3);
				{
				setState(600);
				_errHandler.sync(this);
				switch ( getInterpreter().adaptivePredict(_input,58,_ctx) ) {
				case 1:
					{
					setState(599);
					match(Multiply);
					}
					break;
				}
				setState(603);
				_errHandler.sync(this);
				switch ( getInterpreter().adaptivePredict(_input,59,_ctx) ) {
				case 1:
					{
					setState(602);
					match(Hashtag);
					}
					break;
				}
				setState(605);
				setter();
				setState(606);
				match(OpenParen);
				setState(608);
				_errHandler.sync(this);
				_la = _input.LA(1);
				if ((((_la) & ~0x3f) == 0 && ((1L << _la) & ((1L << OpenBracket) | (1L << OpenBrace) | (1L << Ellipsis))) != 0) || ((((_la - 106)) & ~0x3f) == 0 && ((1L << (_la - 106)) & ((1L << (Async - 106)) | (1L << (NonStrictLet - 106)) | (1L << (Identifier - 106)))) != 0)) {
					{
					setState(607);
					formalParameterList();
					}
				}

				setState(610);
				match(CloseParen);
				setState(611);
				match(OpenBrace);
				setState(612);
				functionBody();
				setState(613);
				match(CloseBrace);
				}
				break;
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class FormalParameterListContext extends ParserRuleContext {
		public List<FormalParameterArgContext> formalParameterArg() {
			return getRuleContexts(FormalParameterArgContext.class);
		}
		public FormalParameterArgContext formalParameterArg(int i) {
			return getRuleContext(FormalParameterArgContext.class,i);
		}
		public List<TerminalNode> Comma() { return getTokens(ECMAScriptParser.Comma); }
		public TerminalNode Comma(int i) {
			return getToken(ECMAScriptParser.Comma, i);
		}
		public LastFormalParameterArgContext lastFormalParameterArg() {
			return getRuleContext(LastFormalParameterArgContext.class,0);
		}
		public FormalParameterListContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_formalParameterList; }
	}

	public final FormalParameterListContext formalParameterList() throws RecognitionException {
		FormalParameterListContext _localctx = new FormalParameterListContext(_ctx, getState());
		enterRule(_localctx, 88, RULE_formalParameterList);
		int _la;
		try {
			int _alt;
			setState(632);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case OpenBracket:
			case OpenBrace:
			case Async:
			case NonStrictLet:
			case Identifier:
				enterOuterAlt(_localctx, 1);
				{
				setState(617);
				formalParameterArg();
				setState(622);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,62,_ctx);
				while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
					if ( _alt==1 ) {
						{
						{
						setState(618);
						match(Comma);
						setState(619);
						formalParameterArg();
						}
						} 
					}
					setState(624);
					_errHandler.sync(this);
					_alt = getInterpreter().adaptivePredict(_input,62,_ctx);
				}
				setState(629);
				_errHandler.sync(this);
				_la = _input.LA(1);
				if (_la==Comma) {
					{
					setState(625);
					match(Comma);
					setState(627);
					_errHandler.sync(this);
					_la = _input.LA(1);
					if (_la==Ellipsis) {
						{
						setState(626);
						lastFormalParameterArg();
						}
					}

					}
				}

				}
				break;
			case Ellipsis:
				enterOuterAlt(_localctx, 2);
				{
				setState(631);
				lastFormalParameterArg();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class FormalParameterArgContext extends ParserRuleContext {
		public AssignableContext assignable() {
			return getRuleContext(AssignableContext.class,0);
		}
		public TerminalNode Assign() { return getToken(ECMAScriptParser.Assign, 0); }
		public SingleExpressionContext singleExpression() {
			return getRuleContext(SingleExpressionContext.class,0);
		}
		public FormalParameterArgContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_formalParameterArg; }
	}

	public final FormalParameterArgContext formalParameterArg() throws RecognitionException {
		FormalParameterArgContext _localctx = new FormalParameterArgContext(_ctx, getState());
		enterRule(_localctx, 90, RULE_formalParameterArg);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(634);
			assignable();
			setState(637);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==Assign) {
				{
				setState(635);
				match(Assign);
				setState(636);
				singleExpression(0);
				}
			}

			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class LastFormalParameterArgContext extends ParserRuleContext {
		public TerminalNode Ellipsis() { return getToken(ECMAScriptParser.Ellipsis, 0); }
		public SingleExpressionContext singleExpression() {
			return getRuleContext(SingleExpressionContext.class,0);
		}
		public LastFormalParameterArgContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_lastFormalParameterArg; }
	}

	public final LastFormalParameterArgContext lastFormalParameterArg() throws RecognitionException {
		LastFormalParameterArgContext _localctx = new LastFormalParameterArgContext(_ctx, getState());
		enterRule(_localctx, 92, RULE_lastFormalParameterArg);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(639);
			match(Ellipsis);
			setState(640);
			singleExpression(0);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class FunctionBodyContext extends ParserRuleContext {
		public SourceElementsContext sourceElements() {
			return getRuleContext(SourceElementsContext.class,0);
		}
		public FunctionBodyContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_functionBody; }
	}

	public final FunctionBodyContext functionBody() throws RecognitionException {
		FunctionBodyContext _localctx = new FunctionBodyContext(_ctx, getState());
		enterRule(_localctx, 94, RULE_functionBody);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(643);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,67,_ctx) ) {
			case 1:
				{
				setState(642);
				sourceElements();
				}
				break;
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class SourceElementsContext extends ParserRuleContext {
		public List<SourceElementContext> sourceElement() {
			return getRuleContexts(SourceElementContext.class);
		}
		public SourceElementContext sourceElement(int i) {
			return getRuleContext(SourceElementContext.class,i);
		}
		public SourceElementsContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_sourceElements; }
	}

	public final SourceElementsContext sourceElements() throws RecognitionException {
		SourceElementsContext _localctx = new SourceElementsContext(_ctx, getState());
		enterRule(_localctx, 96, RULE_sourceElements);
		try {
			int _alt;
			enterOuterAlt(_localctx, 1);
			{
			setState(646); 
			_errHandler.sync(this);
			_alt = 1;
			do {
				switch (_alt) {
				case 1:
					{
					{
					setState(645);
					sourceElement();
					}
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				setState(648); 
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,68,_ctx);
			} while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER );
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class ArrayLiteralContext extends ParserRuleContext {
		public TerminalNode OpenBracket() { return getToken(ECMAScriptParser.OpenBracket, 0); }
		public ElementListContext elementList() {
			return getRuleContext(ElementListContext.class,0);
		}
		public TerminalNode CloseBracket() { return getToken(ECMAScriptParser.CloseBracket, 0); }
		public ArrayLiteralContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_arrayLiteral; }
	}

	public final ArrayLiteralContext arrayLiteral() throws RecognitionException {
		ArrayLiteralContext _localctx = new ArrayLiteralContext(_ctx, getState());
		enterRule(_localctx, 98, RULE_arrayLiteral);
		try {
			enterOuterAlt(_localctx, 1);
			{
			{
			setState(650);
			match(OpenBracket);
			setState(651);
			elementList();
			setState(652);
			match(CloseBracket);
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class ElementListContext extends ParserRuleContext {
		public List<TerminalNode> Comma() { return getTokens(ECMAScriptParser.Comma); }
		public TerminalNode Comma(int i) {
			return getToken(ECMAScriptParser.Comma, i);
		}
		public List<ArrayElementContext> arrayElement() {
			return getRuleContexts(ArrayElementContext.class);
		}
		public ArrayElementContext arrayElement(int i) {
			return getRuleContext(ArrayElementContext.class,i);
		}
		public ElementListContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_elementList; }
	}

	public final ElementListContext elementList() throws RecognitionException {
		ElementListContext _localctx = new ElementListContext(_ctx, getState());
		enterRule(_localctx, 100, RULE_elementList);
		int _la;
		try {
			int _alt;
			enterOuterAlt(_localctx, 1);
			{
			setState(657);
			_errHandler.sync(this);
			_alt = getInterpreter().adaptivePredict(_input,69,_ctx);
			while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
				if ( _alt==1 ) {
					{
					{
					setState(654);
					match(Comma);
					}
					} 
				}
				setState(659);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,69,_ctx);
			}
			setState(661);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (((((_la - 4)) & ~0x3f) == 0 && ((1L << (_la - 4)) & ((1L << (RegularExpressionLiteral - 4)) | (1L << (OpenBracket - 4)) | (1L << (OpenParen - 4)) | (1L << (OpenBrace - 4)) | (1L << (Ellipsis - 4)) | (1L << (PlusPlus - 4)) | (1L << (MinusMinus - 4)) | (1L << (Plus - 4)) | (1L << (Minus - 4)) | (1L << (BitNot - 4)) | (1L << (Not - 4)) | (1L << (NullLiteral - 4)) | (1L << (BooleanLiteral - 4)) | (1L << (DecimalLiteral - 4)) | (1L << (HexIntegerLiteral - 4)) | (1L << (OctalIntegerLiteral - 4)) | (1L << (OctalIntegerLiteral2 - 4)) | (1L << (BinaryIntegerLiteral - 4)) | (1L << (BigHexIntegerLiteral - 4)) | (1L << (BigOctalIntegerLiteral - 4)))) != 0) || ((((_la - 68)) & ~0x3f) == 0 && ((1L << (_la - 68)) & ((1L << (BigBinaryIntegerLiteral - 68)) | (1L << (BigDecimalIntegerLiteral - 68)) | (1L << (Typeof - 68)) | (1L << (New - 68)) | (1L << (Void - 68)) | (1L << (Function - 68)) | (1L << (This - 68)) | (1L << (Delete - 68)) | (1L << (Class - 68)) | (1L << (Super - 68)) | (1L << (Import - 68)) | (1L << (Async - 68)) | (1L << (Await - 68)) | (1L << (Select - 68)) | (1L << (Using - 68)) | (1L << (NonStrictLet - 68)) | (1L << (Yield - 68)) | (1L << (Identifier - 68)) | (1L << (StringLiteral - 68)) | (1L << (TemplateStringLiteral - 68)))) != 0)) {
				{
				setState(660);
				arrayElement();
				}
			}

			setState(671);
			_errHandler.sync(this);
			_alt = getInterpreter().adaptivePredict(_input,72,_ctx);
			while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
				if ( _alt==1 ) {
					{
					{
					setState(664); 
					_errHandler.sync(this);
					_la = _input.LA(1);
					do {
						{
						{
						setState(663);
						match(Comma);
						}
						}
						setState(666); 
						_errHandler.sync(this);
						_la = _input.LA(1);
					} while ( _la==Comma );
					setState(668);
					arrayElement();
					}
					} 
				}
				setState(673);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,72,_ctx);
			}
			setState(677);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==Comma) {
				{
				{
				setState(674);
				match(Comma);
				}
				}
				setState(679);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class ArrayElementContext extends ParserRuleContext {
		public SingleExpressionContext singleExpression() {
			return getRuleContext(SingleExpressionContext.class,0);
		}
		public TerminalNode Ellipsis() { return getToken(ECMAScriptParser.Ellipsis, 0); }
		public ArrayElementContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_arrayElement; }
	}

	public final ArrayElementContext arrayElement() throws RecognitionException {
		ArrayElementContext _localctx = new ArrayElementContext(_ctx, getState());
		enterRule(_localctx, 102, RULE_arrayElement);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(681);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==Ellipsis) {
				{
				setState(680);
				match(Ellipsis);
				}
			}

			setState(683);
			singleExpression(0);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class PropertyAssignmentContext extends ParserRuleContext {
		public PropertyAssignmentContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_propertyAssignment; }
	 
		public PropertyAssignmentContext() { }
		public void copyFrom(PropertyAssignmentContext ctx) {
			super.copyFrom(ctx);
		}
	}
	public static class PropertyExpressionAssignmentContext extends PropertyAssignmentContext {
		public PropertyNameContext propertyName() {
			return getRuleContext(PropertyNameContext.class,0);
		}
		public TerminalNode Colon() { return getToken(ECMAScriptParser.Colon, 0); }
		public SingleExpressionContext singleExpression() {
			return getRuleContext(SingleExpressionContext.class,0);
		}
		public PropertyExpressionAssignmentContext(PropertyAssignmentContext ctx) { copyFrom(ctx); }
	}
	public static class ComputedPropertyExpressionAssignmentContext extends PropertyAssignmentContext {
		public TerminalNode OpenBracket() { return getToken(ECMAScriptParser.OpenBracket, 0); }
		public List<SingleExpressionContext> singleExpression() {
			return getRuleContexts(SingleExpressionContext.class);
		}
		public SingleExpressionContext singleExpression(int i) {
			return getRuleContext(SingleExpressionContext.class,i);
		}
		public TerminalNode CloseBracket() { return getToken(ECMAScriptParser.CloseBracket, 0); }
		public TerminalNode Colon() { return getToken(ECMAScriptParser.Colon, 0); }
		public ComputedPropertyExpressionAssignmentContext(PropertyAssignmentContext ctx) { copyFrom(ctx); }
	}
	public static class PropertyShorthandContext extends PropertyAssignmentContext {
		public SingleExpressionContext singleExpression() {
			return getRuleContext(SingleExpressionContext.class,0);
		}
		public TerminalNode Ellipsis() { return getToken(ECMAScriptParser.Ellipsis, 0); }
		public PropertyShorthandContext(PropertyAssignmentContext ctx) { copyFrom(ctx); }
	}
	public static class PropertySetterContext extends PropertyAssignmentContext {
		public SetterContext setter() {
			return getRuleContext(SetterContext.class,0);
		}
		public TerminalNode OpenParen() { return getToken(ECMAScriptParser.OpenParen, 0); }
		public FormalParameterArgContext formalParameterArg() {
			return getRuleContext(FormalParameterArgContext.class,0);
		}
		public TerminalNode CloseParen() { return getToken(ECMAScriptParser.CloseParen, 0); }
		public TerminalNode OpenBrace() { return getToken(ECMAScriptParser.OpenBrace, 0); }
		public FunctionBodyContext functionBody() {
			return getRuleContext(FunctionBodyContext.class,0);
		}
		public TerminalNode CloseBrace() { return getToken(ECMAScriptParser.CloseBrace, 0); }
		public PropertySetterContext(PropertyAssignmentContext ctx) { copyFrom(ctx); }
	}
	public static class PropertyGetterContext extends PropertyAssignmentContext {
		public GetterContext getter() {
			return getRuleContext(GetterContext.class,0);
		}
		public TerminalNode OpenParen() { return getToken(ECMAScriptParser.OpenParen, 0); }
		public TerminalNode CloseParen() { return getToken(ECMAScriptParser.CloseParen, 0); }
		public TerminalNode OpenBrace() { return getToken(ECMAScriptParser.OpenBrace, 0); }
		public FunctionBodyContext functionBody() {
			return getRuleContext(FunctionBodyContext.class,0);
		}
		public TerminalNode CloseBrace() { return getToken(ECMAScriptParser.CloseBrace, 0); }
		public PropertyGetterContext(PropertyAssignmentContext ctx) { copyFrom(ctx); }
	}
	public static class FunctionPropertyContext extends PropertyAssignmentContext {
		public PropertyNameContext propertyName() {
			return getRuleContext(PropertyNameContext.class,0);
		}
		public TerminalNode OpenParen() { return getToken(ECMAScriptParser.OpenParen, 0); }
		public TerminalNode CloseParen() { return getToken(ECMAScriptParser.CloseParen, 0); }
		public TerminalNode OpenBrace() { return getToken(ECMAScriptParser.OpenBrace, 0); }
		public FunctionBodyContext functionBody() {
			return getRuleContext(FunctionBodyContext.class,0);
		}
		public TerminalNode CloseBrace() { return getToken(ECMAScriptParser.CloseBrace, 0); }
		public TerminalNode Async() { return getToken(ECMAScriptParser.Async, 0); }
		public TerminalNode Multiply() { return getToken(ECMAScriptParser.Multiply, 0); }
		public FormalParameterListContext formalParameterList() {
			return getRuleContext(FormalParameterListContext.class,0);
		}
		public FunctionPropertyContext(PropertyAssignmentContext ctx) { copyFrom(ctx); }
	}

	public final PropertyAssignmentContext propertyAssignment() throws RecognitionException {
		PropertyAssignmentContext _localctx = new PropertyAssignmentContext(_ctx, getState());
		enterRule(_localctx, 104, RULE_propertyAssignment);
		int _la;
		try {
			setState(730);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,79,_ctx) ) {
			case 1:
				_localctx = new PropertyExpressionAssignmentContext(_localctx);
				enterOuterAlt(_localctx, 1);
				{
				setState(685);
				propertyName();
				setState(686);
				match(Colon);
				setState(687);
				singleExpression(0);
				}
				break;
			case 2:
				_localctx = new ComputedPropertyExpressionAssignmentContext(_localctx);
				enterOuterAlt(_localctx, 2);
				{
				setState(689);
				match(OpenBracket);
				setState(690);
				singleExpression(0);
				setState(691);
				match(CloseBracket);
				setState(692);
				match(Colon);
				setState(693);
				singleExpression(0);
				}
				break;
			case 3:
				_localctx = new FunctionPropertyContext(_localctx);
				enterOuterAlt(_localctx, 3);
				{
				setState(696);
				_errHandler.sync(this);
				switch ( getInterpreter().adaptivePredict(_input,75,_ctx) ) {
				case 1:
					{
					setState(695);
					match(Async);
					}
					break;
				}
				setState(699);
				_errHandler.sync(this);
				_la = _input.LA(1);
				if (_la==Multiply) {
					{
					setState(698);
					match(Multiply);
					}
				}

				setState(701);
				propertyName();
				setState(702);
				match(OpenParen);
				setState(704);
				_errHandler.sync(this);
				_la = _input.LA(1);
				if ((((_la) & ~0x3f) == 0 && ((1L << _la) & ((1L << OpenBracket) | (1L << OpenBrace) | (1L << Ellipsis))) != 0) || ((((_la - 106)) & ~0x3f) == 0 && ((1L << (_la - 106)) & ((1L << (Async - 106)) | (1L << (NonStrictLet - 106)) | (1L << (Identifier - 106)))) != 0)) {
					{
					setState(703);
					formalParameterList();
					}
				}

				setState(706);
				match(CloseParen);
				setState(707);
				match(OpenBrace);
				setState(708);
				functionBody();
				setState(709);
				match(CloseBrace);
				}
				break;
			case 4:
				_localctx = new PropertyGetterContext(_localctx);
				enterOuterAlt(_localctx, 4);
				{
				setState(711);
				getter();
				setState(712);
				match(OpenParen);
				setState(713);
				match(CloseParen);
				setState(714);
				match(OpenBrace);
				setState(715);
				functionBody();
				setState(716);
				match(CloseBrace);
				}
				break;
			case 5:
				_localctx = new PropertySetterContext(_localctx);
				enterOuterAlt(_localctx, 5);
				{
				setState(718);
				setter();
				setState(719);
				match(OpenParen);
				setState(720);
				formalParameterArg();
				setState(721);
				match(CloseParen);
				setState(722);
				match(OpenBrace);
				setState(723);
				functionBody();
				setState(724);
				match(CloseBrace);
				}
				break;
			case 6:
				_localctx = new PropertyShorthandContext(_localctx);
				enterOuterAlt(_localctx, 6);
				{
				setState(727);
				_errHandler.sync(this);
				_la = _input.LA(1);
				if (_la==Ellipsis) {
					{
					setState(726);
					match(Ellipsis);
					}
				}

				setState(729);
				singleExpression(0);
				}
				break;
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class PropertyNameContext extends ParserRuleContext {
		public IdentifierNameContext identifierName() {
			return getRuleContext(IdentifierNameContext.class,0);
		}
		public TerminalNode StringLiteral() { return getToken(ECMAScriptParser.StringLiteral, 0); }
		public NumericLiteralContext numericLiteral() {
			return getRuleContext(NumericLiteralContext.class,0);
		}
		public TerminalNode OpenBracket() { return getToken(ECMAScriptParser.OpenBracket, 0); }
		public SingleExpressionContext singleExpression() {
			return getRuleContext(SingleExpressionContext.class,0);
		}
		public TerminalNode CloseBracket() { return getToken(ECMAScriptParser.CloseBracket, 0); }
		public PropertyNameContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_propertyName; }
	}

	public final PropertyNameContext propertyName() throws RecognitionException {
		PropertyNameContext _localctx = new PropertyNameContext(_ctx, getState());
		enterRule(_localctx, 106, RULE_propertyName);
		try {
			setState(739);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case NullLiteral:
			case BooleanLiteral:
			case Break:
			case Do:
			case Instanceof:
			case Typeof:
			case Case:
			case Else:
			case New:
			case Var:
			case Catch:
			case Finally:
			case Return:
			case Void:
			case Continue:
			case For:
			case Switch:
			case While:
			case Debugger:
			case Function:
			case This:
			case With:
			case Default:
			case If:
			case Throw:
			case Delete:
			case In:
			case Try:
			case As:
			case From:
			case Let:
			case Class:
			case Enum:
			case Extends:
			case Super:
			case Const:
			case Export:
			case Import:
			case Async:
			case Await:
			case Implements:
			case Private:
			case Public:
			case Interface:
			case Package:
			case Protected:
			case Static:
			case Yield:
			case Identifier:
				enterOuterAlt(_localctx, 1);
				{
				setState(732);
				identifierName();
				}
				break;
			case StringLiteral:
				enterOuterAlt(_localctx, 2);
				{
				setState(733);
				match(StringLiteral);
				}
				break;
			case DecimalLiteral:
			case HexIntegerLiteral:
			case OctalIntegerLiteral:
			case OctalIntegerLiteral2:
			case BinaryIntegerLiteral:
				enterOuterAlt(_localctx, 3);
				{
				setState(734);
				numericLiteral();
				}
				break;
			case OpenBracket:
				enterOuterAlt(_localctx, 4);
				{
				setState(735);
				match(OpenBracket);
				setState(736);
				singleExpression(0);
				setState(737);
				match(CloseBracket);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class ArgumentsContext extends ParserRuleContext {
		public TerminalNode OpenParen() { return getToken(ECMAScriptParser.OpenParen, 0); }
		public TerminalNode CloseParen() { return getToken(ECMAScriptParser.CloseParen, 0); }
		public List<ArgumentContext> argument() {
			return getRuleContexts(ArgumentContext.class);
		}
		public ArgumentContext argument(int i) {
			return getRuleContext(ArgumentContext.class,i);
		}
		public List<TerminalNode> Comma() { return getTokens(ECMAScriptParser.Comma); }
		public TerminalNode Comma(int i) {
			return getToken(ECMAScriptParser.Comma, i);
		}
		public ArgumentsContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_arguments; }
	}

	public final ArgumentsContext arguments() throws RecognitionException {
		ArgumentsContext _localctx = new ArgumentsContext(_ctx, getState());
		enterRule(_localctx, 108, RULE_arguments);
		int _la;
		try {
			int _alt;
			enterOuterAlt(_localctx, 1);
			{
			setState(741);
			match(OpenParen);
			setState(753);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (((((_la - 4)) & ~0x3f) == 0 && ((1L << (_la - 4)) & ((1L << (RegularExpressionLiteral - 4)) | (1L << (OpenBracket - 4)) | (1L << (OpenParen - 4)) | (1L << (OpenBrace - 4)) | (1L << (Ellipsis - 4)) | (1L << (PlusPlus - 4)) | (1L << (MinusMinus - 4)) | (1L << (Plus - 4)) | (1L << (Minus - 4)) | (1L << (BitNot - 4)) | (1L << (Not - 4)) | (1L << (NullLiteral - 4)) | (1L << (BooleanLiteral - 4)) | (1L << (DecimalLiteral - 4)) | (1L << (HexIntegerLiteral - 4)) | (1L << (OctalIntegerLiteral - 4)) | (1L << (OctalIntegerLiteral2 - 4)) | (1L << (BinaryIntegerLiteral - 4)) | (1L << (BigHexIntegerLiteral - 4)) | (1L << (BigOctalIntegerLiteral - 4)))) != 0) || ((((_la - 68)) & ~0x3f) == 0 && ((1L << (_la - 68)) & ((1L << (BigBinaryIntegerLiteral - 68)) | (1L << (BigDecimalIntegerLiteral - 68)) | (1L << (Typeof - 68)) | (1L << (New - 68)) | (1L << (Void - 68)) | (1L << (Function - 68)) | (1L << (This - 68)) | (1L << (Delete - 68)) | (1L << (Class - 68)) | (1L << (Super - 68)) | (1L << (Import - 68)) | (1L << (Async - 68)) | (1L << (Await - 68)) | (1L << (Select - 68)) | (1L << (Using - 68)) | (1L << (NonStrictLet - 68)) | (1L << (Yield - 68)) | (1L << (Identifier - 68)) | (1L << (StringLiteral - 68)) | (1L << (TemplateStringLiteral - 68)))) != 0)) {
				{
				setState(742);
				argument();
				setState(747);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,81,_ctx);
				while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
					if ( _alt==1 ) {
						{
						{
						setState(743);
						match(Comma);
						setState(744);
						argument();
						}
						} 
					}
					setState(749);
					_errHandler.sync(this);
					_alt = getInterpreter().adaptivePredict(_input,81,_ctx);
				}
				setState(751);
				_errHandler.sync(this);
				_la = _input.LA(1);
				if (_la==Comma) {
					{
					setState(750);
					match(Comma);
					}
				}

				}
			}

			setState(755);
			match(CloseParen);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class ArgumentContext extends ParserRuleContext {
		public SingleExpressionContext singleExpression() {
			return getRuleContext(SingleExpressionContext.class,0);
		}
		public IdentifierContext identifier() {
			return getRuleContext(IdentifierContext.class,0);
		}
		public TerminalNode Ellipsis() { return getToken(ECMAScriptParser.Ellipsis, 0); }
		public ArgumentContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_argument; }
	}

	public final ArgumentContext argument() throws RecognitionException {
		ArgumentContext _localctx = new ArgumentContext(_ctx, getState());
		enterRule(_localctx, 110, RULE_argument);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(758);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==Ellipsis) {
				{
				setState(757);
				match(Ellipsis);
				}
			}

			setState(762);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,85,_ctx) ) {
			case 1:
				{
				setState(760);
				singleExpression(0);
				}
				break;
			case 2:
				{
				setState(761);
				identifier();
				}
				break;
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class ExpressionSequenceContext extends ParserRuleContext {
		public List<SingleExpressionContext> singleExpression() {
			return getRuleContexts(SingleExpressionContext.class);
		}
		public SingleExpressionContext singleExpression(int i) {
			return getRuleContext(SingleExpressionContext.class,i);
		}
		public List<TerminalNode> Comma() { return getTokens(ECMAScriptParser.Comma); }
		public TerminalNode Comma(int i) {
			return getToken(ECMAScriptParser.Comma, i);
		}
		public ExpressionSequenceContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_expressionSequence; }
	}

	public final ExpressionSequenceContext expressionSequence() throws RecognitionException {
		ExpressionSequenceContext _localctx = new ExpressionSequenceContext(_ctx, getState());
		enterRule(_localctx, 112, RULE_expressionSequence);
		try {
			int _alt;
			enterOuterAlt(_localctx, 1);
			{
			setState(764);
			singleExpression(0);
			setState(769);
			_errHandler.sync(this);
			_alt = getInterpreter().adaptivePredict(_input,86,_ctx);
			while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
				if ( _alt==1 ) {
					{
					{
					setState(765);
					match(Comma);
					setState(766);
					singleExpression(0);
					}
					} 
				}
				setState(771);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,86,_ctx);
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class SingleExpressionContext extends ParserRuleContext {
		public SingleExpressionContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_singleExpression; }
	 
		public SingleExpressionContext() { }
		public void copyFrom(SingleExpressionContext ctx) {
			super.copyFrom(ctx);
		}
	}
	public static class TemplateStringExpressionContext extends SingleExpressionContext {
		public SingleExpressionContext singleExpression() {
			return getRuleContext(SingleExpressionContext.class,0);
		}
		public TerminalNode TemplateStringLiteral() { return getToken(ECMAScriptParser.TemplateStringLiteral, 0); }
		public TemplateStringExpressionContext(SingleExpressionContext ctx) { copyFrom(ctx); }
	}
	public static class TernaryExpressionContext extends SingleExpressionContext {
		public List<SingleExpressionContext> singleExpression() {
			return getRuleContexts(SingleExpressionContext.class);
		}
		public SingleExpressionContext singleExpression(int i) {
			return getRuleContext(SingleExpressionContext.class,i);
		}
		public TerminalNode QuestionMark() { return getToken(ECMAScriptParser.QuestionMark, 0); }
		public TerminalNode Colon() { return getToken(ECMAScriptParser.Colon, 0); }
		public TernaryExpressionContext(SingleExpressionContext ctx) { copyFrom(ctx); }
	}
	public static class LogicalAndExpressionContext extends SingleExpressionContext {
		public List<SingleExpressionContext> singleExpression() {
			return getRuleContexts(SingleExpressionContext.class);
		}
		public SingleExpressionContext singleExpression(int i) {
			return getRuleContext(SingleExpressionContext.class,i);
		}
		public TerminalNode And() { return getToken(ECMAScriptParser.And, 0); }
		public LogicalAndExpressionContext(SingleExpressionContext ctx) { copyFrom(ctx); }
	}
	public static class PowerExpressionContext extends SingleExpressionContext {
		public List<SingleExpressionContext> singleExpression() {
			return getRuleContexts(SingleExpressionContext.class);
		}
		public SingleExpressionContext singleExpression(int i) {
			return getRuleContext(SingleExpressionContext.class,i);
		}
		public TerminalNode Power() { return getToken(ECMAScriptParser.Power, 0); }
		public PowerExpressionContext(SingleExpressionContext ctx) { copyFrom(ctx); }
	}
	public static class PreIncrementExpressionContext extends SingleExpressionContext {
		public TerminalNode PlusPlus() { return getToken(ECMAScriptParser.PlusPlus, 0); }
		public SingleExpressionContext singleExpression() {
			return getRuleContext(SingleExpressionContext.class,0);
		}
		public PreIncrementExpressionContext(SingleExpressionContext ctx) { copyFrom(ctx); }
	}
	public static class ObjectLiteralExpressionContext extends SingleExpressionContext {
		public ObjectLiteralContext objectLiteral() {
			return getRuleContext(ObjectLiteralContext.class,0);
		}
		public ObjectLiteralExpressionContext(SingleExpressionContext ctx) { copyFrom(ctx); }
	}
	public static class MetaExpressionContext extends SingleExpressionContext {
		public TerminalNode New() { return getToken(ECMAScriptParser.New, 0); }
		public TerminalNode Dot() { return getToken(ECMAScriptParser.Dot, 0); }
		public IdentifierContext identifier() {
			return getRuleContext(IdentifierContext.class,0);
		}
		public MetaExpressionContext(SingleExpressionContext ctx) { copyFrom(ctx); }
	}
	public static class InExpressionContext extends SingleExpressionContext {
		public List<SingleExpressionContext> singleExpression() {
			return getRuleContexts(SingleExpressionContext.class);
		}
		public SingleExpressionContext singleExpression(int i) {
			return getRuleContext(SingleExpressionContext.class,i);
		}
		public TerminalNode In() { return getToken(ECMAScriptParser.In, 0); }
		public InExpressionContext(SingleExpressionContext ctx) { copyFrom(ctx); }
	}
	public static class LogicalOrExpressionContext extends SingleExpressionContext {
		public List<SingleExpressionContext> singleExpression() {
			return getRuleContexts(SingleExpressionContext.class);
		}
		public SingleExpressionContext singleExpression(int i) {
			return getRuleContext(SingleExpressionContext.class,i);
		}
		public TerminalNode Or() { return getToken(ECMAScriptParser.Or, 0); }
		public LogicalOrExpressionContext(SingleExpressionContext ctx) { copyFrom(ctx); }
	}
	public static class NotExpressionContext extends SingleExpressionContext {
		public TerminalNode Not() { return getToken(ECMAScriptParser.Not, 0); }
		public SingleExpressionContext singleExpression() {
			return getRuleContext(SingleExpressionContext.class,0);
		}
		public NotExpressionContext(SingleExpressionContext ctx) { copyFrom(ctx); }
	}
	public static class PreDecreaseExpressionContext extends SingleExpressionContext {
		public TerminalNode MinusMinus() { return getToken(ECMAScriptParser.MinusMinus, 0); }
		public SingleExpressionContext singleExpression() {
			return getRuleContext(SingleExpressionContext.class,0);
		}
		public PreDecreaseExpressionContext(SingleExpressionContext ctx) { copyFrom(ctx); }
	}
	public static class ArgumentsExpressionContext extends SingleExpressionContext {
		public SingleExpressionContext singleExpression() {
			return getRuleContext(SingleExpressionContext.class,0);
		}
		public ArgumentsContext arguments() {
			return getRuleContext(ArgumentsContext.class,0);
		}
		public ArgumentsExpressionContext(SingleExpressionContext ctx) { copyFrom(ctx); }
	}
	public static class AwaitExpressionContext extends SingleExpressionContext {
		public TerminalNode Await() { return getToken(ECMAScriptParser.Await, 0); }
		public SingleExpressionContext singleExpression() {
			return getRuleContext(SingleExpressionContext.class,0);
		}
		public AwaitExpressionContext(SingleExpressionContext ctx) { copyFrom(ctx); }
	}
	public static class ThisExpressionContext extends SingleExpressionContext {
		public TerminalNode This() { return getToken(ECMAScriptParser.This, 0); }
		public ThisExpressionContext(SingleExpressionContext ctx) { copyFrom(ctx); }
	}
	public static class FunctionExpressionContext extends SingleExpressionContext {
		public AnoymousFunctionContext anoymousFunction() {
			return getRuleContext(AnoymousFunctionContext.class,0);
		}
		public FunctionExpressionContext(SingleExpressionContext ctx) { copyFrom(ctx); }
	}
	public static class UnaryMinusExpressionContext extends SingleExpressionContext {
		public TerminalNode Minus() { return getToken(ECMAScriptParser.Minus, 0); }
		public SingleExpressionContext singleExpression() {
			return getRuleContext(SingleExpressionContext.class,0);
		}
		public UnaryMinusExpressionContext(SingleExpressionContext ctx) { copyFrom(ctx); }
	}
	public static class AssignmentExpressionContext extends SingleExpressionContext {
		public List<SingleExpressionContext> singleExpression() {
			return getRuleContexts(SingleExpressionContext.class);
		}
		public SingleExpressionContext singleExpression(int i) {
			return getRuleContext(SingleExpressionContext.class,i);
		}
		public TerminalNode Assign() { return getToken(ECMAScriptParser.Assign, 0); }
		public AssignmentExpressionContext(SingleExpressionContext ctx) { copyFrom(ctx); }
	}
	public static class PostDecreaseExpressionContext extends SingleExpressionContext {
		public SingleExpressionContext singleExpression() {
			return getRuleContext(SingleExpressionContext.class,0);
		}
		public TerminalNode MinusMinus() { return getToken(ECMAScriptParser.MinusMinus, 0); }
		public PostDecreaseExpressionContext(SingleExpressionContext ctx) { copyFrom(ctx); }
	}
	public static class MemberNewExpressionContext extends SingleExpressionContext {
		public TerminalNode New() { return getToken(ECMAScriptParser.New, 0); }
		public SingleExpressionContext singleExpression() {
			return getRuleContext(SingleExpressionContext.class,0);
		}
		public TerminalNode Dot() { return getToken(ECMAScriptParser.Dot, 0); }
		public IdentifierNameContext identifierName() {
			return getRuleContext(IdentifierNameContext.class,0);
		}
		public ArgumentsContext arguments() {
			return getRuleContext(ArgumentsContext.class,0);
		}
		public MemberNewExpressionContext(SingleExpressionContext ctx) { copyFrom(ctx); }
	}
	public static class TypeofExpressionContext extends SingleExpressionContext {
		public TerminalNode Typeof() { return getToken(ECMAScriptParser.Typeof, 0); }
		public SingleExpressionContext singleExpression() {
			return getRuleContext(SingleExpressionContext.class,0);
		}
		public TypeofExpressionContext(SingleExpressionContext ctx) { copyFrom(ctx); }
	}
	public static class InstanceofExpressionContext extends SingleExpressionContext {
		public List<SingleExpressionContext> singleExpression() {
			return getRuleContexts(SingleExpressionContext.class);
		}
		public SingleExpressionContext singleExpression(int i) {
			return getRuleContext(SingleExpressionContext.class,i);
		}
		public TerminalNode Instanceof() { return getToken(ECMAScriptParser.Instanceof, 0); }
		public InstanceofExpressionContext(SingleExpressionContext ctx) { copyFrom(ctx); }
	}
	public static class UnaryPlusExpressionContext extends SingleExpressionContext {
		public TerminalNode Plus() { return getToken(ECMAScriptParser.Plus, 0); }
		public SingleExpressionContext singleExpression() {
			return getRuleContext(SingleExpressionContext.class,0);
		}
		public UnaryPlusExpressionContext(SingleExpressionContext ctx) { copyFrom(ctx); }
	}
	public static class DeleteExpressionContext extends SingleExpressionContext {
		public TerminalNode Delete() { return getToken(ECMAScriptParser.Delete, 0); }
		public SingleExpressionContext singleExpression() {
			return getRuleContext(SingleExpressionContext.class,0);
		}
		public DeleteExpressionContext(SingleExpressionContext ctx) { copyFrom(ctx); }
	}
	public static class InlinedQueryExpressionContext extends SingleExpressionContext {
		public QueryExpressionContext queryExpression() {
			return getRuleContext(QueryExpressionContext.class,0);
		}
		public InlinedQueryExpressionContext(SingleExpressionContext ctx) { copyFrom(ctx); }
	}
	public static class ImportExpressionContext extends SingleExpressionContext {
		public TerminalNode Import() { return getToken(ECMAScriptParser.Import, 0); }
		public TerminalNode OpenParen() { return getToken(ECMAScriptParser.OpenParen, 0); }
		public SingleExpressionContext singleExpression() {
			return getRuleContext(SingleExpressionContext.class,0);
		}
		public TerminalNode CloseParen() { return getToken(ECMAScriptParser.CloseParen, 0); }
		public ImportExpressionContext(SingleExpressionContext ctx) { copyFrom(ctx); }
	}
	public static class EqualityExpressionContext extends SingleExpressionContext {
		public List<SingleExpressionContext> singleExpression() {
			return getRuleContexts(SingleExpressionContext.class);
		}
		public SingleExpressionContext singleExpression(int i) {
			return getRuleContext(SingleExpressionContext.class,i);
		}
		public TerminalNode Equals_() { return getToken(ECMAScriptParser.Equals_, 0); }
		public TerminalNode NotEquals() { return getToken(ECMAScriptParser.NotEquals, 0); }
		public TerminalNode IdentityEquals() { return getToken(ECMAScriptParser.IdentityEquals, 0); }
		public TerminalNode IdentityNotEquals() { return getToken(ECMAScriptParser.IdentityNotEquals, 0); }
		public EqualityExpressionContext(SingleExpressionContext ctx) { copyFrom(ctx); }
	}
	public static class BitXOrExpressionContext extends SingleExpressionContext {
		public List<SingleExpressionContext> singleExpression() {
			return getRuleContexts(SingleExpressionContext.class);
		}
		public SingleExpressionContext singleExpression(int i) {
			return getRuleContext(SingleExpressionContext.class,i);
		}
		public TerminalNode BitXOr() { return getToken(ECMAScriptParser.BitXOr, 0); }
		public BitXOrExpressionContext(SingleExpressionContext ctx) { copyFrom(ctx); }
	}
	public static class SuperExpressionContext extends SingleExpressionContext {
		public TerminalNode Super() { return getToken(ECMAScriptParser.Super, 0); }
		public SuperExpressionContext(SingleExpressionContext ctx) { copyFrom(ctx); }
	}
	public static class MultiplicativeExpressionContext extends SingleExpressionContext {
		public List<SingleExpressionContext> singleExpression() {
			return getRuleContexts(SingleExpressionContext.class);
		}
		public SingleExpressionContext singleExpression(int i) {
			return getRuleContext(SingleExpressionContext.class,i);
		}
		public TerminalNode Multiply() { return getToken(ECMAScriptParser.Multiply, 0); }
		public TerminalNode Divide() { return getToken(ECMAScriptParser.Divide, 0); }
		public TerminalNode Modulus() { return getToken(ECMAScriptParser.Modulus, 0); }
		public MultiplicativeExpressionContext(SingleExpressionContext ctx) { copyFrom(ctx); }
	}
	public static class BitShiftExpressionContext extends SingleExpressionContext {
		public List<SingleExpressionContext> singleExpression() {
			return getRuleContexts(SingleExpressionContext.class);
		}
		public SingleExpressionContext singleExpression(int i) {
			return getRuleContext(SingleExpressionContext.class,i);
		}
		public TerminalNode LeftShiftArithmetic() { return getToken(ECMAScriptParser.LeftShiftArithmetic, 0); }
		public TerminalNode RightShiftArithmetic() { return getToken(ECMAScriptParser.RightShiftArithmetic, 0); }
		public TerminalNode RightShiftLogical() { return getToken(ECMAScriptParser.RightShiftLogical, 0); }
		public BitShiftExpressionContext(SingleExpressionContext ctx) { copyFrom(ctx); }
	}
	public static class ParenthesizedExpressionContext extends SingleExpressionContext {
		public TerminalNode OpenParen() { return getToken(ECMAScriptParser.OpenParen, 0); }
		public ExpressionSequenceContext expressionSequence() {
			return getRuleContext(ExpressionSequenceContext.class,0);
		}
		public TerminalNode CloseParen() { return getToken(ECMAScriptParser.CloseParen, 0); }
		public ParenthesizedExpressionContext(SingleExpressionContext ctx) { copyFrom(ctx); }
	}
	public static class AdditiveExpressionContext extends SingleExpressionContext {
		public List<SingleExpressionContext> singleExpression() {
			return getRuleContexts(SingleExpressionContext.class);
		}
		public SingleExpressionContext singleExpression(int i) {
			return getRuleContext(SingleExpressionContext.class,i);
		}
		public TerminalNode Plus() { return getToken(ECMAScriptParser.Plus, 0); }
		public TerminalNode Minus() { return getToken(ECMAScriptParser.Minus, 0); }
		public AdditiveExpressionContext(SingleExpressionContext ctx) { copyFrom(ctx); }
	}
	public static class RelationalExpressionContext extends SingleExpressionContext {
		public List<SingleExpressionContext> singleExpression() {
			return getRuleContexts(SingleExpressionContext.class);
		}
		public SingleExpressionContext singleExpression(int i) {
			return getRuleContext(SingleExpressionContext.class,i);
		}
		public TerminalNode LessThan() { return getToken(ECMAScriptParser.LessThan, 0); }
		public TerminalNode MoreThan() { return getToken(ECMAScriptParser.MoreThan, 0); }
		public TerminalNode LessThanEquals() { return getToken(ECMAScriptParser.LessThanEquals, 0); }
		public TerminalNode GreaterThanEquals() { return getToken(ECMAScriptParser.GreaterThanEquals, 0); }
		public RelationalExpressionContext(SingleExpressionContext ctx) { copyFrom(ctx); }
	}
	public static class PostIncrementExpressionContext extends SingleExpressionContext {
		public SingleExpressionContext singleExpression() {
			return getRuleContext(SingleExpressionContext.class,0);
		}
		public TerminalNode PlusPlus() { return getToken(ECMAScriptParser.PlusPlus, 0); }
		public PostIncrementExpressionContext(SingleExpressionContext ctx) { copyFrom(ctx); }
	}
	public static class YieldExpressionContext extends SingleExpressionContext {
		public TerminalNode Yield() { return getToken(ECMAScriptParser.Yield, 0); }
		public ExpressionSequenceContext expressionSequence() {
			return getRuleContext(ExpressionSequenceContext.class,0);
		}
		public TerminalNode Multiply() { return getToken(ECMAScriptParser.Multiply, 0); }
		public YieldExpressionContext(SingleExpressionContext ctx) { copyFrom(ctx); }
	}
	public static class BitNotExpressionContext extends SingleExpressionContext {
		public TerminalNode BitNot() { return getToken(ECMAScriptParser.BitNot, 0); }
		public SingleExpressionContext singleExpression() {
			return getRuleContext(SingleExpressionContext.class,0);
		}
		public BitNotExpressionContext(SingleExpressionContext ctx) { copyFrom(ctx); }
	}
	public static class NewExpressionContext extends SingleExpressionContext {
		public TerminalNode New() { return getToken(ECMAScriptParser.New, 0); }
		public SingleExpressionContext singleExpression() {
			return getRuleContext(SingleExpressionContext.class,0);
		}
		public ArgumentsContext arguments() {
			return getRuleContext(ArgumentsContext.class,0);
		}
		public NewExpressionContext(SingleExpressionContext ctx) { copyFrom(ctx); }
	}
	public static class LiteralExpressionContext extends SingleExpressionContext {
		public LiteralContext literal() {
			return getRuleContext(LiteralContext.class,0);
		}
		public LiteralExpressionContext(SingleExpressionContext ctx) { copyFrom(ctx); }
	}
	public static class ArrayLiteralExpressionContext extends SingleExpressionContext {
		public ArrayLiteralContext arrayLiteral() {
			return getRuleContext(ArrayLiteralContext.class,0);
		}
		public ArrayLiteralExpressionContext(SingleExpressionContext ctx) { copyFrom(ctx); }
	}
	public static class MemberDotExpressionContext extends SingleExpressionContext {
		public SingleExpressionContext singleExpression() {
			return getRuleContext(SingleExpressionContext.class,0);
		}
		public TerminalNode Dot() { return getToken(ECMAScriptParser.Dot, 0); }
		public IdentifierNameContext identifierName() {
			return getRuleContext(IdentifierNameContext.class,0);
		}
		public TerminalNode QuestionMark() { return getToken(ECMAScriptParser.QuestionMark, 0); }
		public TerminalNode Hashtag() { return getToken(ECMAScriptParser.Hashtag, 0); }
		public MemberDotExpressionContext(SingleExpressionContext ctx) { copyFrom(ctx); }
	}
	public static class ClassExpressionContext extends SingleExpressionContext {
		public TerminalNode Class() { return getToken(ECMAScriptParser.Class, 0); }
		public ClassTailContext classTail() {
			return getRuleContext(ClassTailContext.class,0);
		}
		public IdentifierContext identifier() {
			return getRuleContext(IdentifierContext.class,0);
		}
		public ClassExpressionContext(SingleExpressionContext ctx) { copyFrom(ctx); }
	}
	public static class MemberIndexExpressionContext extends SingleExpressionContext {
		public SingleExpressionContext singleExpression() {
			return getRuleContext(SingleExpressionContext.class,0);
		}
		public TerminalNode OpenBracket() { return getToken(ECMAScriptParser.OpenBracket, 0); }
		public ExpressionSequenceContext expressionSequence() {
			return getRuleContext(ExpressionSequenceContext.class,0);
		}
		public TerminalNode CloseBracket() { return getToken(ECMAScriptParser.CloseBracket, 0); }
		public MemberIndexExpressionContext(SingleExpressionContext ctx) { copyFrom(ctx); }
	}
	public static class IdentifierExpressionContext extends SingleExpressionContext {
		public IdentifierContext identifier() {
			return getRuleContext(IdentifierContext.class,0);
		}
		public IdentifierExpressionContext(SingleExpressionContext ctx) { copyFrom(ctx); }
	}
	public static class BitAndExpressionContext extends SingleExpressionContext {
		public List<SingleExpressionContext> singleExpression() {
			return getRuleContexts(SingleExpressionContext.class);
		}
		public SingleExpressionContext singleExpression(int i) {
			return getRuleContext(SingleExpressionContext.class,i);
		}
		public TerminalNode BitAnd() { return getToken(ECMAScriptParser.BitAnd, 0); }
		public BitAndExpressionContext(SingleExpressionContext ctx) { copyFrom(ctx); }
	}
	public static class BitOrExpressionContext extends SingleExpressionContext {
		public List<SingleExpressionContext> singleExpression() {
			return getRuleContexts(SingleExpressionContext.class);
		}
		public SingleExpressionContext singleExpression(int i) {
			return getRuleContext(SingleExpressionContext.class,i);
		}
		public TerminalNode BitOr() { return getToken(ECMAScriptParser.BitOr, 0); }
		public BitOrExpressionContext(SingleExpressionContext ctx) { copyFrom(ctx); }
	}
	public static class AssignmentOperatorExpressionContext extends SingleExpressionContext {
		public List<SingleExpressionContext> singleExpression() {
			return getRuleContexts(SingleExpressionContext.class);
		}
		public SingleExpressionContext singleExpression(int i) {
			return getRuleContext(SingleExpressionContext.class,i);
		}
		public AssignmentOperatorContext assignmentOperator() {
			return getRuleContext(AssignmentOperatorContext.class,0);
		}
		public AssignmentOperatorExpressionContext(SingleExpressionContext ctx) { copyFrom(ctx); }
	}
	public static class VoidExpressionContext extends SingleExpressionContext {
		public TerminalNode Void() { return getToken(ECMAScriptParser.Void, 0); }
		public SingleExpressionContext singleExpression() {
			return getRuleContext(SingleExpressionContext.class,0);
		}
		public VoidExpressionContext(SingleExpressionContext ctx) { copyFrom(ctx); }
	}
	public static class CoalesceExpressionContext extends SingleExpressionContext {
		public List<SingleExpressionContext> singleExpression() {
			return getRuleContexts(SingleExpressionContext.class);
		}
		public SingleExpressionContext singleExpression(int i) {
			return getRuleContext(SingleExpressionContext.class,i);
		}
		public TerminalNode NullCoalesce() { return getToken(ECMAScriptParser.NullCoalesce, 0); }
		public CoalesceExpressionContext(SingleExpressionContext ctx) { copyFrom(ctx); }
	}

	public final SingleExpressionContext singleExpression() throws RecognitionException {
		return singleExpression(0);
	}

	private SingleExpressionContext singleExpression(int _p) throws RecognitionException {
		ParserRuleContext _parentctx = _ctx;
		int _parentState = getState();
		SingleExpressionContext _localctx = new SingleExpressionContext(_ctx, _parentState);
		SingleExpressionContext _prevctx = _localctx;
		int _startState = 114;
		enterRecursionRule(_localctx, 114, RULE_singleExpression, _p);
		int _la;
		try {
			int _alt;
			enterOuterAlt(_localctx, 1);
			{
			setState(841);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,91,_ctx) ) {
			case 1:
				{
				_localctx = new FunctionExpressionContext(_localctx);
				_ctx = _localctx;
				_prevctx = _localctx;

				setState(773);
				anoymousFunction();
				}
				break;
			case 2:
				{
				_localctx = new ClassExpressionContext(_localctx);
				_ctx = _localctx;
				_prevctx = _localctx;
				setState(774);
				match(Class);
				setState(776);
				_errHandler.sync(this);
				_la = _input.LA(1);
				if (((((_la - 106)) & ~0x3f) == 0 && ((1L << (_la - 106)) & ((1L << (Async - 106)) | (1L << (NonStrictLet - 106)) | (1L << (Identifier - 106)))) != 0)) {
					{
					setState(775);
					identifier();
					}
				}

				setState(778);
				classTail();
				}
				break;
			case 3:
				{
				_localctx = new MemberNewExpressionContext(_localctx);
				_ctx = _localctx;
				_prevctx = _localctx;
				setState(779);
				match(New);
				setState(780);
				singleExpression(0);
				setState(781);
				match(Dot);
				setState(782);
				identifierName();
				setState(783);
				arguments();
				}
				break;
			case 4:
				{
				_localctx = new NewExpressionContext(_localctx);
				_ctx = _localctx;
				_prevctx = _localctx;
				setState(785);
				match(New);
				setState(786);
				singleExpression(0);
				setState(787);
				arguments();
				}
				break;
			case 5:
				{
				_localctx = new NewExpressionContext(_localctx);
				_ctx = _localctx;
				_prevctx = _localctx;
				setState(789);
				match(New);
				setState(790);
				singleExpression(0);
				setState(792);
				_errHandler.sync(this);
				switch ( getInterpreter().adaptivePredict(_input,88,_ctx) ) {
				case 1:
					{
					setState(791);
					arguments();
					}
					break;
				}
				}
				break;
			case 6:
				{
				_localctx = new MetaExpressionContext(_localctx);
				_ctx = _localctx;
				_prevctx = _localctx;
				setState(794);
				match(New);
				setState(795);
				match(Dot);
				setState(796);
				identifier();
				}
				break;
			case 7:
				{
				_localctx = new DeleteExpressionContext(_localctx);
				_ctx = _localctx;
				_prevctx = _localctx;
				setState(797);
				match(Delete);
				setState(798);
				singleExpression(38);
				}
				break;
			case 8:
				{
				_localctx = new VoidExpressionContext(_localctx);
				_ctx = _localctx;
				_prevctx = _localctx;
				setState(799);
				match(Void);
				setState(800);
				singleExpression(37);
				}
				break;
			case 9:
				{
				_localctx = new TypeofExpressionContext(_localctx);
				_ctx = _localctx;
				_prevctx = _localctx;
				setState(801);
				match(Typeof);
				setState(802);
				singleExpression(36);
				}
				break;
			case 10:
				{
				_localctx = new PreIncrementExpressionContext(_localctx);
				_ctx = _localctx;
				_prevctx = _localctx;
				setState(803);
				match(PlusPlus);
				setState(804);
				singleExpression(35);
				}
				break;
			case 11:
				{
				_localctx = new PreDecreaseExpressionContext(_localctx);
				_ctx = _localctx;
				_prevctx = _localctx;
				setState(805);
				match(MinusMinus);
				setState(806);
				singleExpression(34);
				}
				break;
			case 12:
				{
				_localctx = new UnaryPlusExpressionContext(_localctx);
				_ctx = _localctx;
				_prevctx = _localctx;
				setState(807);
				match(Plus);
				setState(808);
				singleExpression(33);
				}
				break;
			case 13:
				{
				_localctx = new UnaryMinusExpressionContext(_localctx);
				_ctx = _localctx;
				_prevctx = _localctx;
				setState(809);
				match(Minus);
				setState(810);
				singleExpression(32);
				}
				break;
			case 14:
				{
				_localctx = new BitNotExpressionContext(_localctx);
				_ctx = _localctx;
				_prevctx = _localctx;
				setState(811);
				match(BitNot);
				setState(812);
				singleExpression(31);
				}
				break;
			case 15:
				{
				_localctx = new NotExpressionContext(_localctx);
				_ctx = _localctx;
				_prevctx = _localctx;
				setState(813);
				match(Not);
				setState(814);
				singleExpression(30);
				}
				break;
			case 16:
				{
				_localctx = new AwaitExpressionContext(_localctx);
				_ctx = _localctx;
				_prevctx = _localctx;
				setState(815);
				match(Await);
				setState(816);
				singleExpression(29);
				}
				break;
			case 17:
				{
				_localctx = new ImportExpressionContext(_localctx);
				_ctx = _localctx;
				_prevctx = _localctx;
				setState(817);
				match(Import);
				setState(818);
				match(OpenParen);
				setState(819);
				singleExpression(0);
				setState(820);
				match(CloseParen);
				}
				break;
			case 18:
				{
				_localctx = new ThisExpressionContext(_localctx);
				_ctx = _localctx;
				_prevctx = _localctx;
				setState(822);
				match(This);
				}
				break;
			case 19:
				{
				_localctx = new YieldExpressionContext(_localctx);
				_ctx = _localctx;
				_prevctx = _localctx;
				setState(823);
				match(Yield);
				setState(829);
				_errHandler.sync(this);
				switch ( getInterpreter().adaptivePredict(_input,90,_ctx) ) {
				case 1:
					{
					setState(824);
					if (!(this.notLineTerminator())) throw new FailedPredicateException(this, "this.notLineTerminator()");
					setState(826);
					_errHandler.sync(this);
					_la = _input.LA(1);
					if (_la==Multiply) {
						{
						setState(825);
						match(Multiply);
						}
					}

					setState(828);
					expressionSequence();
					}
					break;
				}
				}
				break;
			case 20:
				{
				_localctx = new IdentifierExpressionContext(_localctx);
				_ctx = _localctx;
				_prevctx = _localctx;
				setState(831);
				identifier();
				}
				break;
			case 21:
				{
				_localctx = new SuperExpressionContext(_localctx);
				_ctx = _localctx;
				_prevctx = _localctx;
				setState(832);
				match(Super);
				}
				break;
			case 22:
				{
				_localctx = new LiteralExpressionContext(_localctx);
				_ctx = _localctx;
				_prevctx = _localctx;
				setState(833);
				literal();
				}
				break;
			case 23:
				{
				_localctx = new ArrayLiteralExpressionContext(_localctx);
				_ctx = _localctx;
				_prevctx = _localctx;
				setState(834);
				arrayLiteral();
				}
				break;
			case 24:
				{
				_localctx = new ObjectLiteralExpressionContext(_localctx);
				_ctx = _localctx;
				_prevctx = _localctx;
				setState(835);
				objectLiteral();
				}
				break;
			case 25:
				{
				_localctx = new ParenthesizedExpressionContext(_localctx);
				_ctx = _localctx;
				_prevctx = _localctx;
				setState(836);
				match(OpenParen);
				setState(837);
				expressionSequence();
				setState(838);
				match(CloseParen);
				}
				break;
			case 26:
				{
				_localctx = new InlinedQueryExpressionContext(_localctx);
				_ctx = _localctx;
				_prevctx = _localctx;
				setState(840);
				queryExpression();
				}
				break;
			}
			_ctx.stop = _input.LT(-1);
			setState(924);
			_errHandler.sync(this);
			_alt = getInterpreter().adaptivePredict(_input,95,_ctx);
			while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
				if ( _alt==1 ) {
					if ( _parseListeners!=null ) triggerExitRuleEvent();
					_prevctx = _localctx;
					{
					setState(922);
					_errHandler.sync(this);
					switch ( getInterpreter().adaptivePredict(_input,94,_ctx) ) {
					case 1:
						{
						_localctx = new PowerExpressionContext(new SingleExpressionContext(_parentctx, _parentState));
						pushNewRecursionContext(_localctx, _startState, RULE_singleExpression);
						setState(843);
						if (!(precpred(_ctx, 28))) throw new FailedPredicateException(this, "precpred(_ctx, 28)");
						setState(844);
						match(Power);
						setState(845);
						singleExpression(28);
						}
						break;
					case 2:
						{
						_localctx = new MultiplicativeExpressionContext(new SingleExpressionContext(_parentctx, _parentState));
						pushNewRecursionContext(_localctx, _startState, RULE_singleExpression);
						setState(846);
						if (!(precpred(_ctx, 27))) throw new FailedPredicateException(this, "precpred(_ctx, 27)");
						setState(847);
						_la = _input.LA(1);
						if ( !((((_la) & ~0x3f) == 0 && ((1L << _la) & ((1L << Multiply) | (1L << Divide) | (1L << Modulus))) != 0)) ) {
						_errHandler.recoverInline(this);
						}
						else {
							if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
							_errHandler.reportMatch(this);
							consume();
						}
						setState(848);
						singleExpression(28);
						}
						break;
					case 3:
						{
						_localctx = new AdditiveExpressionContext(new SingleExpressionContext(_parentctx, _parentState));
						pushNewRecursionContext(_localctx, _startState, RULE_singleExpression);
						setState(849);
						if (!(precpred(_ctx, 26))) throw new FailedPredicateException(this, "precpred(_ctx, 26)");
						setState(850);
						_la = _input.LA(1);
						if ( !(_la==Plus || _la==Minus) ) {
						_errHandler.recoverInline(this);
						}
						else {
							if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
							_errHandler.reportMatch(this);
							consume();
						}
						setState(851);
						singleExpression(27);
						}
						break;
					case 4:
						{
						_localctx = new CoalesceExpressionContext(new SingleExpressionContext(_parentctx, _parentState));
						pushNewRecursionContext(_localctx, _startState, RULE_singleExpression);
						setState(852);
						if (!(precpred(_ctx, 25))) throw new FailedPredicateException(this, "precpred(_ctx, 25)");
						setState(853);
						match(NullCoalesce);
						setState(854);
						singleExpression(26);
						}
						break;
					case 5:
						{
						_localctx = new BitShiftExpressionContext(new SingleExpressionContext(_parentctx, _parentState));
						pushNewRecursionContext(_localctx, _startState, RULE_singleExpression);
						setState(855);
						if (!(precpred(_ctx, 24))) throw new FailedPredicateException(this, "precpred(_ctx, 24)");
						setState(856);
						_la = _input.LA(1);
						if ( !((((_la) & ~0x3f) == 0 && ((1L << _la) & ((1L << RightShiftArithmetic) | (1L << LeftShiftArithmetic) | (1L << RightShiftLogical))) != 0)) ) {
						_errHandler.recoverInline(this);
						}
						else {
							if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
							_errHandler.reportMatch(this);
							consume();
						}
						setState(857);
						singleExpression(25);
						}
						break;
					case 6:
						{
						_localctx = new RelationalExpressionContext(new SingleExpressionContext(_parentctx, _parentState));
						pushNewRecursionContext(_localctx, _startState, RULE_singleExpression);
						setState(858);
						if (!(precpred(_ctx, 23))) throw new FailedPredicateException(this, "precpred(_ctx, 23)");
						setState(859);
						_la = _input.LA(1);
						if ( !((((_la) & ~0x3f) == 0 && ((1L << _la) & ((1L << LessThan) | (1L << MoreThan) | (1L << LessThanEquals) | (1L << GreaterThanEquals))) != 0)) ) {
						_errHandler.recoverInline(this);
						}
						else {
							if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
							_errHandler.reportMatch(this);
							consume();
						}
						setState(860);
						singleExpression(24);
						}
						break;
					case 7:
						{
						_localctx = new InstanceofExpressionContext(new SingleExpressionContext(_parentctx, _parentState));
						pushNewRecursionContext(_localctx, _startState, RULE_singleExpression);
						setState(861);
						if (!(precpred(_ctx, 22))) throw new FailedPredicateException(this, "precpred(_ctx, 22)");
						setState(862);
						match(Instanceof);
						setState(863);
						singleExpression(23);
						}
						break;
					case 8:
						{
						_localctx = new InExpressionContext(new SingleExpressionContext(_parentctx, _parentState));
						pushNewRecursionContext(_localctx, _startState, RULE_singleExpression);
						setState(864);
						if (!(precpred(_ctx, 21))) throw new FailedPredicateException(this, "precpred(_ctx, 21)");
						setState(865);
						match(In);
						setState(866);
						singleExpression(22);
						}
						break;
					case 9:
						{
						_localctx = new EqualityExpressionContext(new SingleExpressionContext(_parentctx, _parentState));
						pushNewRecursionContext(_localctx, _startState, RULE_singleExpression);
						setState(867);
						if (!(precpred(_ctx, 20))) throw new FailedPredicateException(this, "precpred(_ctx, 20)");
						setState(868);
						_la = _input.LA(1);
						if ( !((((_la) & ~0x3f) == 0 && ((1L << _la) & ((1L << Equals_) | (1L << NotEquals) | (1L << IdentityEquals) | (1L << IdentityNotEquals))) != 0)) ) {
						_errHandler.recoverInline(this);
						}
						else {
							if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
							_errHandler.reportMatch(this);
							consume();
						}
						setState(869);
						singleExpression(21);
						}
						break;
					case 10:
						{
						_localctx = new BitAndExpressionContext(new SingleExpressionContext(_parentctx, _parentState));
						pushNewRecursionContext(_localctx, _startState, RULE_singleExpression);
						setState(870);
						if (!(precpred(_ctx, 19))) throw new FailedPredicateException(this, "precpred(_ctx, 19)");
						setState(871);
						match(BitAnd);
						setState(872);
						singleExpression(20);
						}
						break;
					case 11:
						{
						_localctx = new BitXOrExpressionContext(new SingleExpressionContext(_parentctx, _parentState));
						pushNewRecursionContext(_localctx, _startState, RULE_singleExpression);
						setState(873);
						if (!(precpred(_ctx, 18))) throw new FailedPredicateException(this, "precpred(_ctx, 18)");
						setState(874);
						match(BitXOr);
						setState(875);
						singleExpression(19);
						}
						break;
					case 12:
						{
						_localctx = new BitOrExpressionContext(new SingleExpressionContext(_parentctx, _parentState));
						pushNewRecursionContext(_localctx, _startState, RULE_singleExpression);
						setState(876);
						if (!(precpred(_ctx, 17))) throw new FailedPredicateException(this, "precpred(_ctx, 17)");
						setState(877);
						match(BitOr);
						setState(878);
						singleExpression(18);
						}
						break;
					case 13:
						{
						_localctx = new LogicalAndExpressionContext(new SingleExpressionContext(_parentctx, _parentState));
						pushNewRecursionContext(_localctx, _startState, RULE_singleExpression);
						setState(879);
						if (!(precpred(_ctx, 16))) throw new FailedPredicateException(this, "precpred(_ctx, 16)");
						setState(880);
						match(And);
						setState(881);
						singleExpression(17);
						}
						break;
					case 14:
						{
						_localctx = new LogicalOrExpressionContext(new SingleExpressionContext(_parentctx, _parentState));
						pushNewRecursionContext(_localctx, _startState, RULE_singleExpression);
						setState(882);
						if (!(precpred(_ctx, 15))) throw new FailedPredicateException(this, "precpred(_ctx, 15)");
						setState(883);
						match(Or);
						setState(884);
						singleExpression(16);
						}
						break;
					case 15:
						{
						_localctx = new TernaryExpressionContext(new SingleExpressionContext(_parentctx, _parentState));
						pushNewRecursionContext(_localctx, _startState, RULE_singleExpression);
						setState(885);
						if (!(precpred(_ctx, 14))) throw new FailedPredicateException(this, "precpred(_ctx, 14)");
						setState(886);
						match(QuestionMark);
						setState(887);
						singleExpression(0);
						setState(888);
						match(Colon);
						setState(889);
						singleExpression(15);
						}
						break;
					case 16:
						{
						_localctx = new AssignmentExpressionContext(new SingleExpressionContext(_parentctx, _parentState));
						pushNewRecursionContext(_localctx, _startState, RULE_singleExpression);
						setState(891);
						if (!(precpred(_ctx, 13))) throw new FailedPredicateException(this, "precpred(_ctx, 13)");
						setState(892);
						match(Assign);
						setState(893);
						singleExpression(13);
						}
						break;
					case 17:
						{
						_localctx = new AssignmentOperatorExpressionContext(new SingleExpressionContext(_parentctx, _parentState));
						pushNewRecursionContext(_localctx, _startState, RULE_singleExpression);
						setState(894);
						if (!(precpred(_ctx, 12))) throw new FailedPredicateException(this, "precpred(_ctx, 12)");
						setState(895);
						assignmentOperator();
						setState(896);
						singleExpression(12);
						}
						break;
					case 18:
						{
						_localctx = new MemberIndexExpressionContext(new SingleExpressionContext(_parentctx, _parentState));
						pushNewRecursionContext(_localctx, _startState, RULE_singleExpression);
						setState(898);
						if (!(precpred(_ctx, 47))) throw new FailedPredicateException(this, "precpred(_ctx, 47)");
						setState(899);
						match(OpenBracket);
						setState(900);
						expressionSequence();
						setState(901);
						match(CloseBracket);
						}
						break;
					case 19:
						{
						_localctx = new MemberDotExpressionContext(new SingleExpressionContext(_parentctx, _parentState));
						pushNewRecursionContext(_localctx, _startState, RULE_singleExpression);
						setState(903);
						if (!(precpred(_ctx, 45))) throw new FailedPredicateException(this, "precpred(_ctx, 45)");
						setState(905);
						_errHandler.sync(this);
						_la = _input.LA(1);
						if (_la==QuestionMark) {
							{
							setState(904);
							match(QuestionMark);
							}
						}

						setState(907);
						match(Dot);
						setState(909);
						_errHandler.sync(this);
						_la = _input.LA(1);
						if (_la==Hashtag) {
							{
							setState(908);
							match(Hashtag);
							}
						}

						setState(911);
						identifierName();
						}
						break;
					case 20:
						{
						_localctx = new ArgumentsExpressionContext(new SingleExpressionContext(_parentctx, _parentState));
						pushNewRecursionContext(_localctx, _startState, RULE_singleExpression);
						setState(912);
						if (!(precpred(_ctx, 41))) throw new FailedPredicateException(this, "precpred(_ctx, 41)");
						setState(913);
						arguments();
						}
						break;
					case 21:
						{
						_localctx = new PostIncrementExpressionContext(new SingleExpressionContext(_parentctx, _parentState));
						pushNewRecursionContext(_localctx, _startState, RULE_singleExpression);
						setState(914);
						if (!(precpred(_ctx, 40))) throw new FailedPredicateException(this, "precpred(_ctx, 40)");
						setState(915);
						if (!(this.notLineTerminator())) throw new FailedPredicateException(this, "this.notLineTerminator()");
						setState(916);
						match(PlusPlus);
						}
						break;
					case 22:
						{
						_localctx = new PostDecreaseExpressionContext(new SingleExpressionContext(_parentctx, _parentState));
						pushNewRecursionContext(_localctx, _startState, RULE_singleExpression);
						setState(917);
						if (!(precpred(_ctx, 39))) throw new FailedPredicateException(this, "precpred(_ctx, 39)");
						setState(918);
						if (!(this.notLineTerminator())) throw new FailedPredicateException(this, "this.notLineTerminator()");
						setState(919);
						match(MinusMinus);
						}
						break;
					case 23:
						{
						_localctx = new TemplateStringExpressionContext(new SingleExpressionContext(_parentctx, _parentState));
						pushNewRecursionContext(_localctx, _startState, RULE_singleExpression);
						setState(920);
						if (!(precpred(_ctx, 10))) throw new FailedPredicateException(this, "precpred(_ctx, 10)");
						setState(921);
						match(TemplateStringLiteral);
						}
						break;
					}
					} 
				}
				setState(926);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,95,_ctx);
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			unrollRecursionContexts(_parentctx);
		}
		return _localctx;
	}

	public static class AssignableContext extends ParserRuleContext {
		public IdentifierContext identifier() {
			return getRuleContext(IdentifierContext.class,0);
		}
		public ArrayLiteralContext arrayLiteral() {
			return getRuleContext(ArrayLiteralContext.class,0);
		}
		public ObjectLiteralContext objectLiteral() {
			return getRuleContext(ObjectLiteralContext.class,0);
		}
		public AssignableContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_assignable; }
	}

	public final AssignableContext assignable() throws RecognitionException {
		AssignableContext _localctx = new AssignableContext(_ctx, getState());
		enterRule(_localctx, 116, RULE_assignable);
		try {
			setState(930);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case Async:
			case NonStrictLet:
			case Identifier:
				enterOuterAlt(_localctx, 1);
				{
				setState(927);
				identifier();
				}
				break;
			case OpenBracket:
				enterOuterAlt(_localctx, 2);
				{
				setState(928);
				arrayLiteral();
				}
				break;
			case OpenBrace:
				enterOuterAlt(_localctx, 3);
				{
				setState(929);
				objectLiteral();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class ObjectLiteralContext extends ParserRuleContext {
		public TerminalNode OpenBrace() { return getToken(ECMAScriptParser.OpenBrace, 0); }
		public TerminalNode CloseBrace() { return getToken(ECMAScriptParser.CloseBrace, 0); }
		public List<PropertyAssignmentContext> propertyAssignment() {
			return getRuleContexts(PropertyAssignmentContext.class);
		}
		public PropertyAssignmentContext propertyAssignment(int i) {
			return getRuleContext(PropertyAssignmentContext.class,i);
		}
		public List<TerminalNode> Comma() { return getTokens(ECMAScriptParser.Comma); }
		public TerminalNode Comma(int i) {
			return getToken(ECMAScriptParser.Comma, i);
		}
		public ObjectLiteralContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_objectLiteral; }
	}

	public final ObjectLiteralContext objectLiteral() throws RecognitionException {
		ObjectLiteralContext _localctx = new ObjectLiteralContext(_ctx, getState());
		enterRule(_localctx, 118, RULE_objectLiteral);
		int _la;
		try {
			int _alt;
			enterOuterAlt(_localctx, 1);
			{
			setState(932);
			match(OpenBrace);
			setState(941);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,98,_ctx) ) {
			case 1:
				{
				setState(933);
				propertyAssignment();
				setState(938);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,97,_ctx);
				while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
					if ( _alt==1 ) {
						{
						{
						setState(934);
						match(Comma);
						setState(935);
						propertyAssignment();
						}
						} 
					}
					setState(940);
					_errHandler.sync(this);
					_alt = getInterpreter().adaptivePredict(_input,97,_ctx);
				}
				}
				break;
			}
			setState(944);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==Comma) {
				{
				setState(943);
				match(Comma);
				}
			}

			setState(946);
			match(CloseBrace);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class AnoymousFunctionContext extends ParserRuleContext {
		public AnoymousFunctionContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_anoymousFunction; }
	 
		public AnoymousFunctionContext() { }
		public void copyFrom(AnoymousFunctionContext ctx) {
			super.copyFrom(ctx);
		}
	}
	public static class AnoymousFunctionDeclContext extends AnoymousFunctionContext {
		public TerminalNode Function() { return getToken(ECMAScriptParser.Function, 0); }
		public TerminalNode OpenParen() { return getToken(ECMAScriptParser.OpenParen, 0); }
		public TerminalNode CloseParen() { return getToken(ECMAScriptParser.CloseParen, 0); }
		public TerminalNode OpenBrace() { return getToken(ECMAScriptParser.OpenBrace, 0); }
		public FunctionBodyContext functionBody() {
			return getRuleContext(FunctionBodyContext.class,0);
		}
		public TerminalNode CloseBrace() { return getToken(ECMAScriptParser.CloseBrace, 0); }
		public TerminalNode Async() { return getToken(ECMAScriptParser.Async, 0); }
		public TerminalNode Multiply() { return getToken(ECMAScriptParser.Multiply, 0); }
		public FormalParameterListContext formalParameterList() {
			return getRuleContext(FormalParameterListContext.class,0);
		}
		public AnoymousFunctionDeclContext(AnoymousFunctionContext ctx) { copyFrom(ctx); }
	}
	public static class ArrowFunctionContext extends AnoymousFunctionContext {
		public ArrowFunctionParametersContext arrowFunctionParameters() {
			return getRuleContext(ArrowFunctionParametersContext.class,0);
		}
		public TerminalNode ARROW() { return getToken(ECMAScriptParser.ARROW, 0); }
		public ArrowFunctionBodyContext arrowFunctionBody() {
			return getRuleContext(ArrowFunctionBodyContext.class,0);
		}
		public TerminalNode Async() { return getToken(ECMAScriptParser.Async, 0); }
		public ArrowFunctionContext(AnoymousFunctionContext ctx) { copyFrom(ctx); }
	}
	public static class FunctionDeclContext extends AnoymousFunctionContext {
		public FunctionDeclarationContext functionDeclaration() {
			return getRuleContext(FunctionDeclarationContext.class,0);
		}
		public FunctionDeclContext(AnoymousFunctionContext ctx) { copyFrom(ctx); }
	}

	public final AnoymousFunctionContext anoymousFunction() throws RecognitionException {
		AnoymousFunctionContext _localctx = new AnoymousFunctionContext(_ctx, getState());
		enterRule(_localctx, 120, RULE_anoymousFunction);
		int _la;
		try {
			setState(972);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,104,_ctx) ) {
			case 1:
				_localctx = new FunctionDeclContext(_localctx);
				enterOuterAlt(_localctx, 1);
				{
				setState(948);
				functionDeclaration();
				}
				break;
			case 2:
				_localctx = new AnoymousFunctionDeclContext(_localctx);
				enterOuterAlt(_localctx, 2);
				{
				setState(950);
				_errHandler.sync(this);
				_la = _input.LA(1);
				if (_la==Async) {
					{
					setState(949);
					match(Async);
					}
				}

				setState(952);
				match(Function);
				setState(954);
				_errHandler.sync(this);
				_la = _input.LA(1);
				if (_la==Multiply) {
					{
					setState(953);
					match(Multiply);
					}
				}

				setState(956);
				match(OpenParen);
				setState(958);
				_errHandler.sync(this);
				_la = _input.LA(1);
				if ((((_la) & ~0x3f) == 0 && ((1L << _la) & ((1L << OpenBracket) | (1L << OpenBrace) | (1L << Ellipsis))) != 0) || ((((_la - 106)) & ~0x3f) == 0 && ((1L << (_la - 106)) & ((1L << (Async - 106)) | (1L << (NonStrictLet - 106)) | (1L << (Identifier - 106)))) != 0)) {
					{
					setState(957);
					formalParameterList();
					}
				}

				setState(960);
				match(CloseParen);
				setState(961);
				match(OpenBrace);
				setState(962);
				functionBody();
				setState(963);
				match(CloseBrace);
				}
				break;
			case 3:
				_localctx = new ArrowFunctionContext(_localctx);
				enterOuterAlt(_localctx, 3);
				{
				setState(966);
				_errHandler.sync(this);
				switch ( getInterpreter().adaptivePredict(_input,103,_ctx) ) {
				case 1:
					{
					setState(965);
					match(Async);
					}
					break;
				}
				setState(968);
				arrowFunctionParameters();
				setState(969);
				match(ARROW);
				setState(970);
				arrowFunctionBody();
				}
				break;
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class ArrowFunctionParametersContext extends ParserRuleContext {
		public IdentifierContext identifier() {
			return getRuleContext(IdentifierContext.class,0);
		}
		public TerminalNode OpenParen() { return getToken(ECMAScriptParser.OpenParen, 0); }
		public TerminalNode CloseParen() { return getToken(ECMAScriptParser.CloseParen, 0); }
		public FormalParameterListContext formalParameterList() {
			return getRuleContext(FormalParameterListContext.class,0);
		}
		public ArrowFunctionParametersContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_arrowFunctionParameters; }
	}

	public final ArrowFunctionParametersContext arrowFunctionParameters() throws RecognitionException {
		ArrowFunctionParametersContext _localctx = new ArrowFunctionParametersContext(_ctx, getState());
		enterRule(_localctx, 122, RULE_arrowFunctionParameters);
		int _la;
		try {
			setState(980);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case Async:
			case NonStrictLet:
			case Identifier:
				enterOuterAlt(_localctx, 1);
				{
				setState(974);
				identifier();
				}
				break;
			case OpenParen:
				enterOuterAlt(_localctx, 2);
				{
				setState(975);
				match(OpenParen);
				setState(977);
				_errHandler.sync(this);
				_la = _input.LA(1);
				if ((((_la) & ~0x3f) == 0 && ((1L << _la) & ((1L << OpenBracket) | (1L << OpenBrace) | (1L << Ellipsis))) != 0) || ((((_la - 106)) & ~0x3f) == 0 && ((1L << (_la - 106)) & ((1L << (Async - 106)) | (1L << (NonStrictLet - 106)) | (1L << (Identifier - 106)))) != 0)) {
					{
					setState(976);
					formalParameterList();
					}
				}

				setState(979);
				match(CloseParen);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class ArrowFunctionBodyContext extends ParserRuleContext {
		public TerminalNode OpenBrace() { return getToken(ECMAScriptParser.OpenBrace, 0); }
		public FunctionBodyContext functionBody() {
			return getRuleContext(FunctionBodyContext.class,0);
		}
		public TerminalNode CloseBrace() { return getToken(ECMAScriptParser.CloseBrace, 0); }
		public SingleExpressionContext singleExpression() {
			return getRuleContext(SingleExpressionContext.class,0);
		}
		public ArrowFunctionBodyContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_arrowFunctionBody; }
	}

	public final ArrowFunctionBodyContext arrowFunctionBody() throws RecognitionException {
		ArrowFunctionBodyContext _localctx = new ArrowFunctionBodyContext(_ctx, getState());
		enterRule(_localctx, 124, RULE_arrowFunctionBody);
		try {
			setState(987);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,107,_ctx) ) {
			case 1:
				enterOuterAlt(_localctx, 1);
				{
				setState(982);
				match(OpenBrace);
				setState(983);
				functionBody();
				setState(984);
				match(CloseBrace);
				}
				break;
			case 2:
				enterOuterAlt(_localctx, 2);
				{
				setState(986);
				singleExpression(0);
				}
				break;
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class AssignmentOperatorContext extends ParserRuleContext {
		public TerminalNode MultiplyAssign() { return getToken(ECMAScriptParser.MultiplyAssign, 0); }
		public TerminalNode DivideAssign() { return getToken(ECMAScriptParser.DivideAssign, 0); }
		public TerminalNode ModulusAssign() { return getToken(ECMAScriptParser.ModulusAssign, 0); }
		public TerminalNode PlusAssign() { return getToken(ECMAScriptParser.PlusAssign, 0); }
		public TerminalNode MinusAssign() { return getToken(ECMAScriptParser.MinusAssign, 0); }
		public TerminalNode LeftShiftArithmeticAssign() { return getToken(ECMAScriptParser.LeftShiftArithmeticAssign, 0); }
		public TerminalNode RightShiftArithmeticAssign() { return getToken(ECMAScriptParser.RightShiftArithmeticAssign, 0); }
		public TerminalNode RightShiftLogicalAssign() { return getToken(ECMAScriptParser.RightShiftLogicalAssign, 0); }
		public TerminalNode BitAndAssign() { return getToken(ECMAScriptParser.BitAndAssign, 0); }
		public TerminalNode BitXorAssign() { return getToken(ECMAScriptParser.BitXorAssign, 0); }
		public TerminalNode BitOrAssign() { return getToken(ECMAScriptParser.BitOrAssign, 0); }
		public TerminalNode PowerAssign() { return getToken(ECMAScriptParser.PowerAssign, 0); }
		public AssignmentOperatorContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_assignmentOperator; }
	}

	public final AssignmentOperatorContext assignmentOperator() throws RecognitionException {
		AssignmentOperatorContext _localctx = new AssignmentOperatorContext(_ctx, getState());
		enterRule(_localctx, 126, RULE_assignmentOperator);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(989);
			_la = _input.LA(1);
			if ( !((((_la) & ~0x3f) == 0 && ((1L << _la) & ((1L << MultiplyAssign) | (1L << DivideAssign) | (1L << ModulusAssign) | (1L << PlusAssign) | (1L << MinusAssign) | (1L << LeftShiftArithmeticAssign) | (1L << RightShiftArithmeticAssign) | (1L << RightShiftLogicalAssign) | (1L << BitAndAssign) | (1L << BitXorAssign) | (1L << BitOrAssign) | (1L << PowerAssign))) != 0)) ) {
			_errHandler.recoverInline(this);
			}
			else {
				if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
				_errHandler.reportMatch(this);
				consume();
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class LiteralContext extends ParserRuleContext {
		public TerminalNode NullLiteral() { return getToken(ECMAScriptParser.NullLiteral, 0); }
		public TerminalNode BooleanLiteral() { return getToken(ECMAScriptParser.BooleanLiteral, 0); }
		public TerminalNode StringLiteral() { return getToken(ECMAScriptParser.StringLiteral, 0); }
		public TerminalNode TemplateStringLiteral() { return getToken(ECMAScriptParser.TemplateStringLiteral, 0); }
		public TerminalNode RegularExpressionLiteral() { return getToken(ECMAScriptParser.RegularExpressionLiteral, 0); }
		public NumericLiteralContext numericLiteral() {
			return getRuleContext(NumericLiteralContext.class,0);
		}
		public BigintLiteralContext bigintLiteral() {
			return getRuleContext(BigintLiteralContext.class,0);
		}
		public LiteralContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_literal; }
	}

	public final LiteralContext literal() throws RecognitionException {
		LiteralContext _localctx = new LiteralContext(_ctx, getState());
		enterRule(_localctx, 128, RULE_literal);
		try {
			setState(998);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case NullLiteral:
				enterOuterAlt(_localctx, 1);
				{
				setState(991);
				match(NullLiteral);
				}
				break;
			case BooleanLiteral:
				enterOuterAlt(_localctx, 2);
				{
				setState(992);
				match(BooleanLiteral);
				}
				break;
			case StringLiteral:
				enterOuterAlt(_localctx, 3);
				{
				setState(993);
				match(StringLiteral);
				}
				break;
			case TemplateStringLiteral:
				enterOuterAlt(_localctx, 4);
				{
				setState(994);
				match(TemplateStringLiteral);
				}
				break;
			case RegularExpressionLiteral:
				enterOuterAlt(_localctx, 5);
				{
				setState(995);
				match(RegularExpressionLiteral);
				}
				break;
			case DecimalLiteral:
			case HexIntegerLiteral:
			case OctalIntegerLiteral:
			case OctalIntegerLiteral2:
			case BinaryIntegerLiteral:
				enterOuterAlt(_localctx, 6);
				{
				setState(996);
				numericLiteral();
				}
				break;
			case BigHexIntegerLiteral:
			case BigOctalIntegerLiteral:
			case BigBinaryIntegerLiteral:
			case BigDecimalIntegerLiteral:
				enterOuterAlt(_localctx, 7);
				{
				setState(997);
				bigintLiteral();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class NumericLiteralContext extends ParserRuleContext {
		public TerminalNode DecimalLiteral() { return getToken(ECMAScriptParser.DecimalLiteral, 0); }
		public TerminalNode HexIntegerLiteral() { return getToken(ECMAScriptParser.HexIntegerLiteral, 0); }
		public TerminalNode OctalIntegerLiteral() { return getToken(ECMAScriptParser.OctalIntegerLiteral, 0); }
		public TerminalNode OctalIntegerLiteral2() { return getToken(ECMAScriptParser.OctalIntegerLiteral2, 0); }
		public TerminalNode BinaryIntegerLiteral() { return getToken(ECMAScriptParser.BinaryIntegerLiteral, 0); }
		public NumericLiteralContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_numericLiteral; }
	}

	public final NumericLiteralContext numericLiteral() throws RecognitionException {
		NumericLiteralContext _localctx = new NumericLiteralContext(_ctx, getState());
		enterRule(_localctx, 130, RULE_numericLiteral);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(1000);
			_la = _input.LA(1);
			if ( !(((((_la - 61)) & ~0x3f) == 0 && ((1L << (_la - 61)) & ((1L << (DecimalLiteral - 61)) | (1L << (HexIntegerLiteral - 61)) | (1L << (OctalIntegerLiteral - 61)) | (1L << (OctalIntegerLiteral2 - 61)) | (1L << (BinaryIntegerLiteral - 61)))) != 0)) ) {
			_errHandler.recoverInline(this);
			}
			else {
				if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
				_errHandler.reportMatch(this);
				consume();
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class BigintLiteralContext extends ParserRuleContext {
		public TerminalNode BigDecimalIntegerLiteral() { return getToken(ECMAScriptParser.BigDecimalIntegerLiteral, 0); }
		public TerminalNode BigHexIntegerLiteral() { return getToken(ECMAScriptParser.BigHexIntegerLiteral, 0); }
		public TerminalNode BigOctalIntegerLiteral() { return getToken(ECMAScriptParser.BigOctalIntegerLiteral, 0); }
		public TerminalNode BigBinaryIntegerLiteral() { return getToken(ECMAScriptParser.BigBinaryIntegerLiteral, 0); }
		public BigintLiteralContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_bigintLiteral; }
	}

	public final BigintLiteralContext bigintLiteral() throws RecognitionException {
		BigintLiteralContext _localctx = new BigintLiteralContext(_ctx, getState());
		enterRule(_localctx, 132, RULE_bigintLiteral);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(1002);
			_la = _input.LA(1);
			if ( !(((((_la - 66)) & ~0x3f) == 0 && ((1L << (_la - 66)) & ((1L << (BigHexIntegerLiteral - 66)) | (1L << (BigOctalIntegerLiteral - 66)) | (1L << (BigBinaryIntegerLiteral - 66)) | (1L << (BigDecimalIntegerLiteral - 66)))) != 0)) ) {
			_errHandler.recoverInline(this);
			}
			else {
				if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
				_errHandler.reportMatch(this);
				consume();
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class GetterContext extends ParserRuleContext {
		public IdentifierContext identifier() {
			return getRuleContext(IdentifierContext.class,0);
		}
		public PropertyNameContext propertyName() {
			return getRuleContext(PropertyNameContext.class,0);
		}
		public GetterContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_getter; }
	}

	public final GetterContext getter() throws RecognitionException {
		GetterContext _localctx = new GetterContext(_ctx, getState());
		enterRule(_localctx, 134, RULE_getter);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(1004);
			if (!(this.n("get"))) throw new FailedPredicateException(this, "this.n(\"get\")");
			setState(1005);
			identifier();
			setState(1006);
			propertyName();
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class SetterContext extends ParserRuleContext {
		public IdentifierContext identifier() {
			return getRuleContext(IdentifierContext.class,0);
		}
		public PropertyNameContext propertyName() {
			return getRuleContext(PropertyNameContext.class,0);
		}
		public SetterContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_setter; }
	}

	public final SetterContext setter() throws RecognitionException {
		SetterContext _localctx = new SetterContext(_ctx, getState());
		enterRule(_localctx, 136, RULE_setter);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(1008);
			if (!(this.n("set"))) throw new FailedPredicateException(this, "this.n(\"set\")");
			setState(1009);
			identifier();
			setState(1010);
			propertyName();
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class IdentifierNameContext extends ParserRuleContext {
		public TerminalNode Identifier() { return getToken(ECMAScriptParser.Identifier, 0); }
		public ReservedWordContext reservedWord() {
			return getRuleContext(ReservedWordContext.class,0);
		}
		public IdentifierNameContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_identifierName; }
	}

	public final IdentifierNameContext identifierName() throws RecognitionException {
		IdentifierNameContext _localctx = new IdentifierNameContext(_ctx, getState());
		enterRule(_localctx, 138, RULE_identifierName);
		try {
			setState(1014);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case Identifier:
				enterOuterAlt(_localctx, 1);
				{
				setState(1012);
				match(Identifier);
				}
				break;
			case NullLiteral:
			case BooleanLiteral:
			case Break:
			case Do:
			case Instanceof:
			case Typeof:
			case Case:
			case Else:
			case New:
			case Var:
			case Catch:
			case Finally:
			case Return:
			case Void:
			case Continue:
			case For:
			case Switch:
			case While:
			case Debugger:
			case Function:
			case This:
			case With:
			case Default:
			case If:
			case Throw:
			case Delete:
			case In:
			case Try:
			case As:
			case From:
			case Let:
			case Class:
			case Enum:
			case Extends:
			case Super:
			case Const:
			case Export:
			case Import:
			case Async:
			case Await:
			case Implements:
			case Private:
			case Public:
			case Interface:
			case Package:
			case Protected:
			case Static:
			case Yield:
				enterOuterAlt(_localctx, 2);
				{
				setState(1013);
				reservedWord();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class IdentifierContext extends ParserRuleContext {
		public TerminalNode Identifier() { return getToken(ECMAScriptParser.Identifier, 0); }
		public TerminalNode NonStrictLet() { return getToken(ECMAScriptParser.NonStrictLet, 0); }
		public TerminalNode Async() { return getToken(ECMAScriptParser.Async, 0); }
		public IdentifierContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_identifier; }
	}

	public final IdentifierContext identifier() throws RecognitionException {
		IdentifierContext _localctx = new IdentifierContext(_ctx, getState());
		enterRule(_localctx, 140, RULE_identifier);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(1016);
			_la = _input.LA(1);
			if ( !(((((_la - 106)) & ~0x3f) == 0 && ((1L << (_la - 106)) & ((1L << (Async - 106)) | (1L << (NonStrictLet - 106)) | (1L << (Identifier - 106)))) != 0)) ) {
			_errHandler.recoverInline(this);
			}
			else {
				if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
				_errHandler.reportMatch(this);
				consume();
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class ReservedWordContext extends ParserRuleContext {
		public KeywordContext keyword() {
			return getRuleContext(KeywordContext.class,0);
		}
		public TerminalNode NullLiteral() { return getToken(ECMAScriptParser.NullLiteral, 0); }
		public TerminalNode BooleanLiteral() { return getToken(ECMAScriptParser.BooleanLiteral, 0); }
		public ReservedWordContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_reservedWord; }
	}

	public final ReservedWordContext reservedWord() throws RecognitionException {
		ReservedWordContext _localctx = new ReservedWordContext(_ctx, getState());
		enterRule(_localctx, 142, RULE_reservedWord);
		try {
			setState(1021);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case Break:
			case Do:
			case Instanceof:
			case Typeof:
			case Case:
			case Else:
			case New:
			case Var:
			case Catch:
			case Finally:
			case Return:
			case Void:
			case Continue:
			case For:
			case Switch:
			case While:
			case Debugger:
			case Function:
			case This:
			case With:
			case Default:
			case If:
			case Throw:
			case Delete:
			case In:
			case Try:
			case As:
			case From:
			case Let:
			case Class:
			case Enum:
			case Extends:
			case Super:
			case Const:
			case Export:
			case Import:
			case Async:
			case Await:
			case Implements:
			case Private:
			case Public:
			case Interface:
			case Package:
			case Protected:
			case Static:
			case Yield:
				enterOuterAlt(_localctx, 1);
				{
				setState(1018);
				keyword();
				}
				break;
			case NullLiteral:
				enterOuterAlt(_localctx, 2);
				{
				setState(1019);
				match(NullLiteral);
				}
				break;
			case BooleanLiteral:
				enterOuterAlt(_localctx, 3);
				{
				setState(1020);
				match(BooleanLiteral);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class KeywordContext extends ParserRuleContext {
		public TerminalNode Break() { return getToken(ECMAScriptParser.Break, 0); }
		public TerminalNode Do() { return getToken(ECMAScriptParser.Do, 0); }
		public TerminalNode Instanceof() { return getToken(ECMAScriptParser.Instanceof, 0); }
		public TerminalNode Typeof() { return getToken(ECMAScriptParser.Typeof, 0); }
		public TerminalNode Case() { return getToken(ECMAScriptParser.Case, 0); }
		public TerminalNode Else() { return getToken(ECMAScriptParser.Else, 0); }
		public TerminalNode New() { return getToken(ECMAScriptParser.New, 0); }
		public TerminalNode Var() { return getToken(ECMAScriptParser.Var, 0); }
		public TerminalNode Catch() { return getToken(ECMAScriptParser.Catch, 0); }
		public TerminalNode Finally() { return getToken(ECMAScriptParser.Finally, 0); }
		public TerminalNode Return() { return getToken(ECMAScriptParser.Return, 0); }
		public TerminalNode Void() { return getToken(ECMAScriptParser.Void, 0); }
		public TerminalNode Continue() { return getToken(ECMAScriptParser.Continue, 0); }
		public TerminalNode For() { return getToken(ECMAScriptParser.For, 0); }
		public TerminalNode Switch() { return getToken(ECMAScriptParser.Switch, 0); }
		public TerminalNode While() { return getToken(ECMAScriptParser.While, 0); }
		public TerminalNode Debugger() { return getToken(ECMAScriptParser.Debugger, 0); }
		public TerminalNode Function() { return getToken(ECMAScriptParser.Function, 0); }
		public TerminalNode This() { return getToken(ECMAScriptParser.This, 0); }
		public TerminalNode With() { return getToken(ECMAScriptParser.With, 0); }
		public TerminalNode Default() { return getToken(ECMAScriptParser.Default, 0); }
		public TerminalNode If() { return getToken(ECMAScriptParser.If, 0); }
		public TerminalNode Throw() { return getToken(ECMAScriptParser.Throw, 0); }
		public TerminalNode Delete() { return getToken(ECMAScriptParser.Delete, 0); }
		public TerminalNode In() { return getToken(ECMAScriptParser.In, 0); }
		public TerminalNode Try() { return getToken(ECMAScriptParser.Try, 0); }
		public TerminalNode Class() { return getToken(ECMAScriptParser.Class, 0); }
		public TerminalNode Enum() { return getToken(ECMAScriptParser.Enum, 0); }
		public TerminalNode Extends() { return getToken(ECMAScriptParser.Extends, 0); }
		public TerminalNode Super() { return getToken(ECMAScriptParser.Super, 0); }
		public TerminalNode Const() { return getToken(ECMAScriptParser.Const, 0); }
		public TerminalNode Export() { return getToken(ECMAScriptParser.Export, 0); }
		public TerminalNode Import() { return getToken(ECMAScriptParser.Import, 0); }
		public TerminalNode Implements() { return getToken(ECMAScriptParser.Implements, 0); }
		public TerminalNode Let() { return getToken(ECMAScriptParser.Let, 0); }
		public TerminalNode Private() { return getToken(ECMAScriptParser.Private, 0); }
		public TerminalNode Public() { return getToken(ECMAScriptParser.Public, 0); }
		public TerminalNode Interface() { return getToken(ECMAScriptParser.Interface, 0); }
		public TerminalNode Package() { return getToken(ECMAScriptParser.Package, 0); }
		public TerminalNode Protected() { return getToken(ECMAScriptParser.Protected, 0); }
		public TerminalNode Static() { return getToken(ECMAScriptParser.Static, 0); }
		public TerminalNode Yield() { return getToken(ECMAScriptParser.Yield, 0); }
		public TerminalNode Async() { return getToken(ECMAScriptParser.Async, 0); }
		public TerminalNode Await() { return getToken(ECMAScriptParser.Await, 0); }
		public TerminalNode From() { return getToken(ECMAScriptParser.From, 0); }
		public TerminalNode As() { return getToken(ECMAScriptParser.As, 0); }
		public KeywordContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_keyword; }
	}

	public final KeywordContext keyword() throws RecognitionException {
		KeywordContext _localctx = new KeywordContext(_ctx, getState());
		enterRule(_localctx, 144, RULE_keyword);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(1023);
			_la = _input.LA(1);
			if ( !(((((_la - 70)) & ~0x3f) == 0 && ((1L << (_la - 70)) & ((1L << (Break - 70)) | (1L << (Do - 70)) | (1L << (Instanceof - 70)) | (1L << (Typeof - 70)) | (1L << (Case - 70)) | (1L << (Else - 70)) | (1L << (New - 70)) | (1L << (Var - 70)) | (1L << (Catch - 70)) | (1L << (Finally - 70)) | (1L << (Return - 70)) | (1L << (Void - 70)) | (1L << (Continue - 70)) | (1L << (For - 70)) | (1L << (Switch - 70)) | (1L << (While - 70)) | (1L << (Debugger - 70)) | (1L << (Function - 70)) | (1L << (This - 70)) | (1L << (With - 70)) | (1L << (Default - 70)) | (1L << (If - 70)) | (1L << (Throw - 70)) | (1L << (Delete - 70)) | (1L << (In - 70)) | (1L << (Try - 70)) | (1L << (As - 70)) | (1L << (From - 70)) | (1L << (Let - 70)) | (1L << (Class - 70)) | (1L << (Enum - 70)) | (1L << (Extends - 70)) | (1L << (Super - 70)) | (1L << (Const - 70)) | (1L << (Export - 70)) | (1L << (Import - 70)) | (1L << (Async - 70)) | (1L << (Await - 70)) | (1L << (Implements - 70)) | (1L << (Private - 70)) | (1L << (Public - 70)) | (1L << (Interface - 70)) | (1L << (Package - 70)) | (1L << (Protected - 70)) | (1L << (Static - 70)) | (1L << (Yield - 70)))) != 0)) ) {
			_errHandler.recoverInline(this);
			}
			else {
				if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
				_errHandler.reportMatch(this);
				consume();
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class EosContext extends ParserRuleContext {
		public TerminalNode SemiColon() { return getToken(ECMAScriptParser.SemiColon, 0); }
		public TerminalNode EOF() { return getToken(ECMAScriptParser.EOF, 0); }
		public EosContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_eos; }
	}

	public final EosContext eos() throws RecognitionException {
		EosContext _localctx = new EosContext(_ctx, getState());
		enterRule(_localctx, 146, RULE_eos);
		try {
			setState(1029);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,111,_ctx) ) {
			case 1:
				enterOuterAlt(_localctx, 1);
				{
				setState(1025);
				match(SemiColon);
				}
				break;
			case 2:
				enterOuterAlt(_localctx, 2);
				{
				setState(1026);
				match(EOF);
				}
				break;
			case 3:
				enterOuterAlt(_localctx, 3);
				{
				setState(1027);
				if (!(this.lineTerminatorAhead())) throw new FailedPredicateException(this, "this.lineTerminatorAhead()");
				}
				break;
			case 4:
				enterOuterAlt(_localctx, 4);
				{
				setState(1028);
				if (!(this.closeBrace())) throw new FailedPredicateException(this, "this.closeBrace()");
				}
				break;
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class QuerySelectStatementContext extends ParserRuleContext {
		public QueryExpressionContext queryExpression() {
			return getRuleContext(QueryExpressionContext.class,0);
		}
		public QuerySelectStatementContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_querySelectStatement; }
	}

	public final QuerySelectStatementContext querySelectStatement() throws RecognitionException {
		QuerySelectStatementContext _localctx = new QuerySelectStatementContext(_ctx, getState());
		enterRule(_localctx, 148, RULE_querySelectStatement);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(1031);
			queryExpression();
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class QueryExpressionContext extends ParserRuleContext {
		public QuerySpecificationContext querySpecification() {
			return getRuleContext(QuerySpecificationContext.class,0);
		}
		public TerminalNode OpenParen() { return getToken(ECMAScriptParser.OpenParen, 0); }
		public QueryExpressionContext queryExpression() {
			return getRuleContext(QueryExpressionContext.class,0);
		}
		public TerminalNode CloseParen() { return getToken(ECMAScriptParser.CloseParen, 0); }
		public List<Sql_unionContext> sql_union() {
			return getRuleContexts(Sql_unionContext.class);
		}
		public Sql_unionContext sql_union(int i) {
			return getRuleContext(Sql_unionContext.class,i);
		}
		public QueryExpressionContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_queryExpression; }
	}

	public final QueryExpressionContext queryExpression() throws RecognitionException {
		QueryExpressionContext _localctx = new QueryExpressionContext(_ctx, getState());
		enterRule(_localctx, 150, RULE_queryExpression);
		try {
			int _alt;
			enterOuterAlt(_localctx, 1);
			{
			setState(1038);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case Select:
			case Using:
				{
				setState(1033);
				querySpecification();
				}
				break;
			case OpenParen:
				{
				setState(1034);
				match(OpenParen);
				setState(1035);
				queryExpression();
				setState(1036);
				match(CloseParen);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			setState(1043);
			_errHandler.sync(this);
			_alt = getInterpreter().adaptivePredict(_input,113,_ctx);
			while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
				if ( _alt==1 ) {
					{
					{
					setState(1040);
					sql_union();
					}
					} 
				}
				setState(1045);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,113,_ctx);
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class Sql_unionContext extends ParserRuleContext {
		public Sql_unionContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_sql_union; }
	 
		public Sql_unionContext() { }
		public void copyFrom(Sql_unionContext ctx) {
			super.copyFrom(ctx);
		}
	}
	public static class QueryUnionExpressionContext extends Sql_unionContext {
		public TerminalNode Union() { return getToken(ECMAScriptParser.Union, 0); }
		public QuerySpecificationContext querySpecification() {
			return getRuleContext(QuerySpecificationContext.class,0);
		}
		public TerminalNode OpenParen() { return getToken(ECMAScriptParser.OpenParen, 0); }
		public QueryExpressionContext queryExpression() {
			return getRuleContext(QueryExpressionContext.class,0);
		}
		public TerminalNode CloseParen() { return getToken(ECMAScriptParser.CloseParen, 0); }
		public TerminalNode All() { return getToken(ECMAScriptParser.All, 0); }
		public QueryUnionExpressionContext(Sql_unionContext ctx) { copyFrom(ctx); }
	}

	public final Sql_unionContext sql_union() throws RecognitionException {
		Sql_unionContext _localctx = new Sql_unionContext(_ctx, getState());
		enterRule(_localctx, 152, RULE_sql_union);
		int _la;
		try {
			_localctx = new QueryUnionExpressionContext(_localctx);
			enterOuterAlt(_localctx, 1);
			{
			{
			setState(1046);
			match(Union);
			setState(1048);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==All) {
				{
				setState(1047);
				match(All);
				}
			}

			}
			setState(1055);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case Select:
			case Using:
				{
				setState(1050);
				querySpecification();
				}
				break;
			case OpenParen:
				{
				{
				setState(1051);
				match(OpenParen);
				setState(1052);
				queryExpression();
				setState(1053);
				match(CloseParen);
				}
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class QuerySpecificationContext extends ParserRuleContext {
		public QuerySpecificationContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_querySpecification; }
	 
		public QuerySpecificationContext() { }
		public void copyFrom(QuerySpecificationContext ctx) {
			super.copyFrom(ctx);
		}
	}
	public static class QuerySelectExpressionContext extends QuerySpecificationContext {
		public TerminalNode Select() { return getToken(ECMAScriptParser.Select, 0); }
		public Select_listContext select_list() {
			return getRuleContext(Select_listContext.class,0);
		}
		public Bind_clauseContext bind_clause() {
			return getRuleContext(Bind_clauseContext.class,0);
		}
		public WithinClauseContext withinClause() {
			return getRuleContext(WithinClauseContext.class,0);
		}
		public FromClauseContext fromClause() {
			return getRuleContext(FromClauseContext.class,0);
		}
		public WhereClauseContext whereClause() {
			return getRuleContext(WhereClauseContext.class,0);
		}
		public Produce_clauseContext produce_clause() {
			return getRuleContext(Produce_clauseContext.class,0);
		}
		public QuerySelectExpressionContext(QuerySpecificationContext ctx) { copyFrom(ctx); }
	}

	public final QuerySpecificationContext querySpecification() throws RecognitionException {
		QuerySpecificationContext _localctx = new QuerySpecificationContext(_ctx, getState());
		enterRule(_localctx, 154, RULE_querySpecification);
		int _la;
		try {
			_localctx = new QuerySelectExpressionContext(_localctx);
			enterOuterAlt(_localctx, 1);
			{
			setState(1058);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==Using) {
				{
				setState(1057);
				bind_clause();
				}
			}

			setState(1060);
			match(Select);
			setState(1061);
			select_list();
			setState(1063);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,117,_ctx) ) {
			case 1:
				{
				setState(1062);
				withinClause();
				}
				break;
			}
			setState(1066);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,118,_ctx) ) {
			case 1:
				{
				setState(1065);
				fromClause();
				}
				break;
			}
			setState(1069);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,119,_ctx) ) {
			case 1:
				{
				setState(1068);
				whereClause();
				}
				break;
			}
			setState(1072);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,120,_ctx) ) {
			case 1:
				{
				setState(1071);
				produce_clause();
				}
				break;
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class Select_listContext extends ParserRuleContext {
		public Select_listContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_select_list; }
	 
		public Select_listContext() { }
		public void copyFrom(Select_listContext ctx) {
			super.copyFrom(ctx);
		}
	}
	public static class QuerySelectListExpressionContext extends Select_listContext {
		public List<Select_list_elemContext> select_list_elem() {
			return getRuleContexts(Select_list_elemContext.class);
		}
		public Select_list_elemContext select_list_elem(int i) {
			return getRuleContext(Select_list_elemContext.class,i);
		}
		public List<TerminalNode> Comma() { return getTokens(ECMAScriptParser.Comma); }
		public TerminalNode Comma(int i) {
			return getToken(ECMAScriptParser.Comma, i);
		}
		public QuerySelectListExpressionContext(Select_listContext ctx) { copyFrom(ctx); }
	}

	public final Select_listContext select_list() throws RecognitionException {
		Select_listContext _localctx = new Select_listContext(_ctx, getState());
		enterRule(_localctx, 156, RULE_select_list);
		try {
			int _alt;
			_localctx = new QuerySelectListExpressionContext(_localctx);
			enterOuterAlt(_localctx, 1);
			{
			setState(1074);
			select_list_elem();
			setState(1079);
			_errHandler.sync(this);
			_alt = getInterpreter().adaptivePredict(_input,121,_ctx);
			while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
				if ( _alt==1 ) {
					{
					{
					setState(1075);
					match(Comma);
					setState(1076);
					select_list_elem();
					}
					} 
				}
				setState(1081);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,121,_ctx);
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class Select_list_elemContext extends ParserRuleContext {
		public TerminalNode Multiply() { return getToken(ECMAScriptParser.Multiply, 0); }
		public IdentifierContext identifier() {
			return getRuleContext(IdentifierContext.class,0);
		}
		public TerminalNode As() { return getToken(ECMAScriptParser.As, 0); }
		public IdentifierNameContext identifierName() {
			return getRuleContext(IdentifierNameContext.class,0);
		}
		public SingleExpressionContext singleExpression() {
			return getRuleContext(SingleExpressionContext.class,0);
		}
		public ArgumentsContext arguments() {
			return getRuleContext(ArgumentsContext.class,0);
		}
		public Select_list_elemContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_select_list_elem; }
	}

	public final Select_list_elemContext select_list_elem() throws RecognitionException {
		Select_list_elemContext _localctx = new Select_list_elemContext(_ctx, getState());
		enterRule(_localctx, 158, RULE_select_list_elem);
		try {
			setState(1094);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,124,_ctx) ) {
			case 1:
				enterOuterAlt(_localctx, 1);
				{
				setState(1082);
				match(Multiply);
				}
				break;
			case 2:
				enterOuterAlt(_localctx, 2);
				{
				setState(1083);
				identifier();
				setState(1086);
				_errHandler.sync(this);
				switch ( getInterpreter().adaptivePredict(_input,122,_ctx) ) {
				case 1:
					{
					setState(1084);
					match(As);
					setState(1085);
					identifierName();
					}
					break;
				}
				}
				break;
			case 3:
				enterOuterAlt(_localctx, 3);
				{
				setState(1088);
				singleExpression(0);
				setState(1089);
				arguments();
				setState(1092);
				_errHandler.sync(this);
				switch ( getInterpreter().adaptivePredict(_input,123,_ctx) ) {
				case 1:
					{
					setState(1090);
					match(As);
					setState(1091);
					identifierName();
					}
					break;
				}
				}
				break;
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class FromClauseContext extends ParserRuleContext {
		public FromClauseContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_fromClause; }
	 
		public FromClauseContext() { }
		public void copyFrom(FromClauseContext ctx) {
			super.copyFrom(ctx);
		}
	}
	public static class QueryFromExpressionContext extends FromClauseContext {
		public TerminalNode From() { return getToken(ECMAScriptParser.From, 0); }
		public DataSourcesContext dataSources() {
			return getRuleContext(DataSourcesContext.class,0);
		}
		public QueryFromExpressionContext(FromClauseContext ctx) { copyFrom(ctx); }
	}

	public final FromClauseContext fromClause() throws RecognitionException {
		FromClauseContext _localctx = new FromClauseContext(_ctx, getState());
		enterRule(_localctx, 160, RULE_fromClause);
		try {
			_localctx = new QueryFromExpressionContext(_localctx);
			enterOuterAlt(_localctx, 1);
			{
			setState(1096);
			match(From);
			setState(1097);
			dataSources();
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class WhereClauseContext extends ParserRuleContext {
		public WhereClauseContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_whereClause; }
	 
		public WhereClauseContext() { }
		public void copyFrom(WhereClauseContext ctx) {
			super.copyFrom(ctx);
		}
	}
	public static class QueryWhereExpressionContext extends WhereClauseContext {
		public TerminalNode Where() { return getToken(ECMAScriptParser.Where, 0); }
		public ExpressionSequenceContext expressionSequence() {
			return getRuleContext(ExpressionSequenceContext.class,0);
		}
		public QueryWhereExpressionContext(WhereClauseContext ctx) { copyFrom(ctx); }
	}

	public final WhereClauseContext whereClause() throws RecognitionException {
		WhereClauseContext _localctx = new WhereClauseContext(_ctx, getState());
		enterRule(_localctx, 162, RULE_whereClause);
		try {
			_localctx = new QueryWhereExpressionContext(_localctx);
			enterOuterAlt(_localctx, 1);
			{
			setState(1099);
			match(Where);
			setState(1100);
			expressionSequence();
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class DataSourcesContext extends ParserRuleContext {
		public DataSourcesContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_dataSources; }
	 
		public DataSourcesContext() { }
		public void copyFrom(DataSourcesContext ctx) {
			super.copyFrom(ctx);
		}
	}
	public static class QueryDataSourcesExpressionContext extends DataSourcesContext {
		public List<DataSourceContext> dataSource() {
			return getRuleContexts(DataSourceContext.class);
		}
		public DataSourceContext dataSource(int i) {
			return getRuleContext(DataSourceContext.class,i);
		}
		public List<TerminalNode> Comma() { return getTokens(ECMAScriptParser.Comma); }
		public TerminalNode Comma(int i) {
			return getToken(ECMAScriptParser.Comma, i);
		}
		public QueryDataSourcesExpressionContext(DataSourcesContext ctx) { copyFrom(ctx); }
	}

	public final DataSourcesContext dataSources() throws RecognitionException {
		DataSourcesContext _localctx = new DataSourcesContext(_ctx, getState());
		enterRule(_localctx, 164, RULE_dataSources);
		try {
			int _alt;
			_localctx = new QueryDataSourcesExpressionContext(_localctx);
			enterOuterAlt(_localctx, 1);
			{
			setState(1102);
			dataSource();
			setState(1107);
			_errHandler.sync(this);
			_alt = getInterpreter().adaptivePredict(_input,125,_ctx);
			while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
				if ( _alt==1 ) {
					{
					{
					setState(1103);
					match(Comma);
					setState(1104);
					dataSource();
					}
					} 
				}
				setState(1109);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,125,_ctx);
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class DataSourceContext extends ParserRuleContext {
		public Data_source_item_joinedContext data_source_item_joined() {
			return getRuleContext(Data_source_item_joinedContext.class,0);
		}
		public TerminalNode OpenParen() { return getToken(ECMAScriptParser.OpenParen, 0); }
		public TerminalNode CloseParen() { return getToken(ECMAScriptParser.CloseParen, 0); }
		public DataSourceContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_dataSource; }
	}

	public final DataSourceContext dataSource() throws RecognitionException {
		DataSourceContext _localctx = new DataSourceContext(_ctx, getState());
		enterRule(_localctx, 166, RULE_dataSource);
		try {
			setState(1115);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,126,_ctx) ) {
			case 1:
				enterOuterAlt(_localctx, 1);
				{
				setState(1110);
				data_source_item_joined();
				}
				break;
			case 2:
				enterOuterAlt(_localctx, 2);
				{
				setState(1111);
				match(OpenParen);
				setState(1112);
				data_source_item_joined();
				setState(1113);
				match(CloseParen);
				}
				break;
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class Data_source_item_joinedContext extends ParserRuleContext {
		public Data_source_item_joinedContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_data_source_item_joined; }
	 
		public Data_source_item_joinedContext() { }
		public void copyFrom(Data_source_item_joinedContext ctx) {
			super.copyFrom(ctx);
		}
	}
	public static class QueryDataSourceExpressionContext extends Data_source_item_joinedContext {
		public Data_source_itemContext data_source_item() {
			return getRuleContext(Data_source_itemContext.class,0);
		}
		public Using_source_clauseContext using_source_clause() {
			return getRuleContext(Using_source_clauseContext.class,0);
		}
		public List<Join_clauseContext> join_clause() {
			return getRuleContexts(Join_clauseContext.class);
		}
		public Join_clauseContext join_clause(int i) {
			return getRuleContext(Join_clauseContext.class,i);
		}
		public QueryDataSourceExpressionContext(Data_source_item_joinedContext ctx) { copyFrom(ctx); }
	}

	public final Data_source_item_joinedContext data_source_item_joined() throws RecognitionException {
		Data_source_item_joinedContext _localctx = new Data_source_item_joinedContext(_ctx, getState());
		enterRule(_localctx, 168, RULE_data_source_item_joined);
		try {
			int _alt;
			_localctx = new QueryDataSourceExpressionContext(_localctx);
			enterOuterAlt(_localctx, 1);
			{
			setState(1117);
			data_source_item();
			setState(1119);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,127,_ctx) ) {
			case 1:
				{
				setState(1118);
				using_source_clause();
				}
				break;
			}
			setState(1124);
			_errHandler.sync(this);
			_alt = getInterpreter().adaptivePredict(_input,128,_ctx);
			while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
				if ( _alt==1 ) {
					{
					{
					setState(1121);
					join_clause();
					}
					} 
				}
				setState(1126);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,128,_ctx);
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class Data_source_itemContext extends ParserRuleContext {
		public Data_source_itemContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_data_source_item; }
	 
		public Data_source_itemContext() { }
		public void copyFrom(Data_source_itemContext ctx) {
			super.copyFrom(ctx);
		}
	}
	public static class QueryDataSourceItemIdentifierExpressionContext extends Data_source_itemContext {
		public IdentifierContext identifier() {
			return getRuleContext(IdentifierContext.class,0);
		}
		public QueryDataSourceItemIdentifierExpressionContext(Data_source_itemContext ctx) { copyFrom(ctx); }
	}
	public static class QueryDataSourceItemUrlExpressionContext extends Data_source_itemContext {
		public TerminalNode Url() { return getToken(ECMAScriptParser.Url, 0); }
		public QueryDataSourceItemUrlExpressionContext(Data_source_itemContext ctx) { copyFrom(ctx); }
	}
	public static class QueryDataSourceItemArgumentsExpressionContext extends Data_source_itemContext {
		public SingleExpressionContext singleExpression() {
			return getRuleContext(SingleExpressionContext.class,0);
		}
		public ArgumentsContext arguments() {
			return getRuleContext(ArgumentsContext.class,0);
		}
		public QueryDataSourceItemArgumentsExpressionContext(Data_source_itemContext ctx) { copyFrom(ctx); }
	}
	public static class QueryDataSourceItemSubqueryExpressionContext extends Data_source_itemContext {
		public TerminalNode OpenParen() { return getToken(ECMAScriptParser.OpenParen, 0); }
		public QueryExpressionContext queryExpression() {
			return getRuleContext(QueryExpressionContext.class,0);
		}
		public TerminalNode CloseParen() { return getToken(ECMAScriptParser.CloseParen, 0); }
		public QueryDataSourceItemSubqueryExpressionContext(Data_source_itemContext ctx) { copyFrom(ctx); }
	}

	public final Data_source_itemContext data_source_item() throws RecognitionException {
		Data_source_itemContext _localctx = new Data_source_itemContext(_ctx, getState());
		enterRule(_localctx, 170, RULE_data_source_item);
		try {
			setState(1136);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,129,_ctx) ) {
			case 1:
				_localctx = new QueryDataSourceItemUrlExpressionContext(_localctx);
				enterOuterAlt(_localctx, 1);
				{
				setState(1127);
				match(Url);
				}
				break;
			case 2:
				_localctx = new QueryDataSourceItemArgumentsExpressionContext(_localctx);
				enterOuterAlt(_localctx, 2);
				{
				setState(1128);
				singleExpression(0);
				setState(1129);
				arguments();
				}
				break;
			case 3:
				_localctx = new QueryDataSourceItemIdentifierExpressionContext(_localctx);
				enterOuterAlt(_localctx, 3);
				{
				setState(1131);
				identifier();
				}
				break;
			case 4:
				_localctx = new QueryDataSourceItemSubqueryExpressionContext(_localctx);
				enterOuterAlt(_localctx, 4);
				{
				setState(1132);
				match(OpenParen);
				setState(1133);
				queryExpression();
				setState(1134);
				match(CloseParen);
				}
				break;
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class Join_clauseContext extends ParserRuleContext {
		public Join_clauseContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_join_clause; }
	 
		public Join_clauseContext() { }
		public void copyFrom(Join_clauseContext ctx) {
			super.copyFrom(ctx);
		}
	}
	public static class QueryJoinCrossApplyExpressionContext extends Join_clauseContext {
		public TerminalNode Join() { return getToken(ECMAScriptParser.Join, 0); }
		public DataSourcesContext dataSources() {
			return getRuleContext(DataSourcesContext.class,0);
		}
		public QueryJoinCrossApplyExpressionContext(Join_clauseContext ctx) { copyFrom(ctx); }
	}
	public static class QueryJoinOnExpressionContext extends Join_clauseContext {
		public TerminalNode Join() { return getToken(ECMAScriptParser.Join, 0); }
		public DataSourcesContext dataSources() {
			return getRuleContext(DataSourcesContext.class,0);
		}
		public TerminalNode On() { return getToken(ECMAScriptParser.On, 0); }
		public List<SingleExpressionContext> singleExpression() {
			return getRuleContexts(SingleExpressionContext.class);
		}
		public SingleExpressionContext singleExpression(int i) {
			return getRuleContext(SingleExpressionContext.class,i);
		}
		public TerminalNode Equals_() { return getToken(ECMAScriptParser.Equals_, 0); }
		public TerminalNode IdentityEquals() { return getToken(ECMAScriptParser.IdentityEquals, 0); }
		public QueryJoinOnExpressionContext(Join_clauseContext ctx) { copyFrom(ctx); }
	}

	public final Join_clauseContext join_clause() throws RecognitionException {
		Join_clauseContext _localctx = new Join_clauseContext(_ctx, getState());
		enterRule(_localctx, 172, RULE_join_clause);
		int _la;
		try {
			setState(1147);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,130,_ctx) ) {
			case 1:
				_localctx = new QueryJoinCrossApplyExpressionContext(_localctx);
				enterOuterAlt(_localctx, 1);
				{
				setState(1138);
				match(Join);
				setState(1139);
				dataSources();
				}
				break;
			case 2:
				_localctx = new QueryJoinOnExpressionContext(_localctx);
				enterOuterAlt(_localctx, 2);
				{
				setState(1140);
				match(Join);
				setState(1141);
				dataSources();
				setState(1142);
				match(On);
				setState(1143);
				singleExpression(0);
				setState(1144);
				_la = _input.LA(1);
				if ( !(_la==Equals_ || _la==IdentityEquals) ) {
				_errHandler.recoverInline(this);
				}
				else {
					if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
					_errHandler.reportMatch(this);
					consume();
				}
				setState(1145);
				singleExpression(0);
				}
				break;
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class Using_source_clauseContext extends ParserRuleContext {
		public Using_source_clauseContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_using_source_clause; }
	 
		public Using_source_clauseContext() { }
		public void copyFrom(Using_source_clauseContext ctx) {
			super.copyFrom(ctx);
		}
	}
	public static class QuerySourceUsingLiteralExpressionContext extends Using_source_clauseContext {
		public TerminalNode Using() { return getToken(ECMAScriptParser.Using, 0); }
		public QueryObjectLiteralContext queryObjectLiteral() {
			return getRuleContext(QueryObjectLiteralContext.class,0);
		}
		public QuerySourceUsingLiteralExpressionContext(Using_source_clauseContext ctx) { copyFrom(ctx); }
	}
	public static class QuerySourceUsingSingleExpressionContext extends Using_source_clauseContext {
		public TerminalNode Using() { return getToken(ECMAScriptParser.Using, 0); }
		public SingleExpressionContext singleExpression() {
			return getRuleContext(SingleExpressionContext.class,0);
		}
		public QuerySourceUsingSingleExpressionContext(Using_source_clauseContext ctx) { copyFrom(ctx); }
	}

	public final Using_source_clauseContext using_source_clause() throws RecognitionException {
		Using_source_clauseContext _localctx = new Using_source_clauseContext(_ctx, getState());
		enterRule(_localctx, 174, RULE_using_source_clause);
		try {
			setState(1153);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,131,_ctx) ) {
			case 1:
				_localctx = new QuerySourceUsingLiteralExpressionContext(_localctx);
				enterOuterAlt(_localctx, 1);
				{
				setState(1149);
				match(Using);
				setState(1150);
				queryObjectLiteral();
				}
				break;
			case 2:
				_localctx = new QuerySourceUsingSingleExpressionContext(_localctx);
				enterOuterAlt(_localctx, 2);
				{
				setState(1151);
				match(Using);
				setState(1152);
				singleExpression(0);
				}
				break;
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class Produce_clauseContext extends ParserRuleContext {
		public Produce_clauseContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_produce_clause; }
	 
		public Produce_clauseContext() { }
		public void copyFrom(Produce_clauseContext ctx) {
			super.copyFrom(ctx);
		}
	}
	public static class QueryProduceExpressionContext extends Produce_clauseContext {
		public TerminalNode Produce() { return getToken(ECMAScriptParser.Produce, 0); }
		public SingleExpressionContext singleExpression() {
			return getRuleContext(SingleExpressionContext.class,0);
		}
		public QueryProduceExpressionContext(Produce_clauseContext ctx) { copyFrom(ctx); }
	}

	public final Produce_clauseContext produce_clause() throws RecognitionException {
		Produce_clauseContext _localctx = new Produce_clauseContext(_ctx, getState());
		enterRule(_localctx, 176, RULE_produce_clause);
		try {
			_localctx = new QueryProduceExpressionContext(_localctx);
			enterOuterAlt(_localctx, 1);
			{
			setState(1155);
			match(Produce);
			setState(1156);
			singleExpression(0);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class Bind_clauseContext extends ParserRuleContext {
		public Bind_clauseContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_bind_clause; }
	 
		public Bind_clauseContext() { }
		public void copyFrom(Bind_clauseContext ctx) {
			super.copyFrom(ctx);
		}
	}
	public static class QueryBindExpressionContext extends Bind_clauseContext {
		public TerminalNode Using() { return getToken(ECMAScriptParser.Using, 0); }
		public SingleExpressionContext singleExpression() {
			return getRuleContext(SingleExpressionContext.class,0);
		}
		public QueryBindExpressionContext(Bind_clauseContext ctx) { copyFrom(ctx); }
	}

	public final Bind_clauseContext bind_clause() throws RecognitionException {
		Bind_clauseContext _localctx = new Bind_clauseContext(_ctx, getState());
		enterRule(_localctx, 178, RULE_bind_clause);
		try {
			_localctx = new QueryBindExpressionContext(_localctx);
			enterOuterAlt(_localctx, 1);
			{
			setState(1158);
			match(Using);
			setState(1159);
			singleExpression(0);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class WithinClauseContext extends ParserRuleContext {
		public WithinClauseContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_withinClause; }
	 
		public WithinClauseContext() { }
		public void copyFrom(WithinClauseContext ctx) {
			super.copyFrom(ctx);
		}
	}
	public static class QueryWithinExpressionContext extends WithinClauseContext {
		public TerminalNode Within() { return getToken(ECMAScriptParser.Within, 0); }
		public List<SingleExpressionContext> singleExpression() {
			return getRuleContexts(SingleExpressionContext.class);
		}
		public SingleExpressionContext singleExpression(int i) {
			return getRuleContext(SingleExpressionContext.class,i);
		}
		public List<TerminalNode> Comma() { return getTokens(ECMAScriptParser.Comma); }
		public TerminalNode Comma(int i) {
			return getToken(ECMAScriptParser.Comma, i);
		}
		public QueryWithinExpressionContext(WithinClauseContext ctx) { copyFrom(ctx); }
	}

	public final WithinClauseContext withinClause() throws RecognitionException {
		WithinClauseContext _localctx = new WithinClauseContext(_ctx, getState());
		enterRule(_localctx, 180, RULE_withinClause);
		try {
			int _alt;
			_localctx = new QueryWithinExpressionContext(_localctx);
			enterOuterAlt(_localctx, 1);
			{
			setState(1161);
			match(Within);
			setState(1162);
			singleExpression(0);
			setState(1167);
			_errHandler.sync(this);
			_alt = getInterpreter().adaptivePredict(_input,132,_ctx);
			while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
				if ( _alt==1 ) {
					{
					{
					setState(1163);
					match(Comma);
					setState(1164);
					singleExpression(0);
					}
					} 
				}
				setState(1169);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,132,_ctx);
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class QueryObjectLiteralContext extends ParserRuleContext {
		public TerminalNode OpenBrace() { return getToken(ECMAScriptParser.OpenBrace, 0); }
		public TerminalNode CloseBrace() { return getToken(ECMAScriptParser.CloseBrace, 0); }
		public List<QueryPropertyAssignmentContext> queryPropertyAssignment() {
			return getRuleContexts(QueryPropertyAssignmentContext.class);
		}
		public QueryPropertyAssignmentContext queryPropertyAssignment(int i) {
			return getRuleContext(QueryPropertyAssignmentContext.class,i);
		}
		public List<TerminalNode> Comma() { return getTokens(ECMAScriptParser.Comma); }
		public TerminalNode Comma(int i) {
			return getToken(ECMAScriptParser.Comma, i);
		}
		public QueryObjectLiteralContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_queryObjectLiteral; }
	}

	public final QueryObjectLiteralContext queryObjectLiteral() throws RecognitionException {
		QueryObjectLiteralContext _localctx = new QueryObjectLiteralContext(_ctx, getState());
		enterRule(_localctx, 182, RULE_queryObjectLiteral);
		int _la;
		try {
			int _alt;
			enterOuterAlt(_localctx, 1);
			{
			setState(1170);
			match(OpenBrace);
			setState(1179);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (((((_la - 5)) & ~0x3f) == 0 && ((1L << (_la - 5)) & ((1L << (OpenBracket - 5)) | (1L << (NullLiteral - 5)) | (1L << (BooleanLiteral - 5)) | (1L << (DecimalLiteral - 5)) | (1L << (HexIntegerLiteral - 5)) | (1L << (OctalIntegerLiteral - 5)) | (1L << (OctalIntegerLiteral2 - 5)) | (1L << (BinaryIntegerLiteral - 5)))) != 0) || ((((_la - 70)) & ~0x3f) == 0 && ((1L << (_la - 70)) & ((1L << (Break - 70)) | (1L << (Do - 70)) | (1L << (Instanceof - 70)) | (1L << (Typeof - 70)) | (1L << (Case - 70)) | (1L << (Else - 70)) | (1L << (New - 70)) | (1L << (Var - 70)) | (1L << (Catch - 70)) | (1L << (Finally - 70)) | (1L << (Return - 70)) | (1L << (Void - 70)) | (1L << (Continue - 70)) | (1L << (For - 70)) | (1L << (Switch - 70)) | (1L << (While - 70)) | (1L << (Debugger - 70)) | (1L << (Function - 70)) | (1L << (This - 70)) | (1L << (With - 70)) | (1L << (Default - 70)) | (1L << (If - 70)) | (1L << (Throw - 70)) | (1L << (Delete - 70)) | (1L << (In - 70)) | (1L << (Try - 70)) | (1L << (As - 70)) | (1L << (From - 70)) | (1L << (Let - 70)) | (1L << (Class - 70)) | (1L << (Enum - 70)) | (1L << (Extends - 70)) | (1L << (Super - 70)) | (1L << (Const - 70)) | (1L << (Export - 70)) | (1L << (Import - 70)) | (1L << (Async - 70)) | (1L << (Await - 70)) | (1L << (Implements - 70)) | (1L << (Private - 70)) | (1L << (Public - 70)) | (1L << (Interface - 70)) | (1L << (Package - 70)) | (1L << (Protected - 70)) | (1L << (Static - 70)) | (1L << (Yield - 70)) | (1L << (Identifier - 70)) | (1L << (StringLiteral - 70)))) != 0)) {
				{
				setState(1171);
				queryPropertyAssignment();
				setState(1176);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,133,_ctx);
				while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
					if ( _alt==1 ) {
						{
						{
						setState(1172);
						match(Comma);
						setState(1173);
						queryPropertyAssignment();
						}
						} 
					}
					setState(1178);
					_errHandler.sync(this);
					_alt = getInterpreter().adaptivePredict(_input,133,_ctx);
				}
				}
			}

			setState(1182);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==Comma) {
				{
				setState(1181);
				match(Comma);
				}
			}

			setState(1184);
			match(CloseBrace);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class QueryPropertyAssignmentContext extends ParserRuleContext {
		public PropertyNameContext propertyName() {
			return getRuleContext(PropertyNameContext.class,0);
		}
		public TerminalNode Colon() { return getToken(ECMAScriptParser.Colon, 0); }
		public SingleExpressionContext singleExpression() {
			return getRuleContext(SingleExpressionContext.class,0);
		}
		public QueryPropertyAssignmentContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_queryPropertyAssignment; }
	}

	public final QueryPropertyAssignmentContext queryPropertyAssignment() throws RecognitionException {
		QueryPropertyAssignmentContext _localctx = new QueryPropertyAssignmentContext(_ctx, getState());
		enterRule(_localctx, 184, RULE_queryPropertyAssignment);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(1186);
			propertyName();
			setState(1187);
			match(Colon);
			setState(1188);
			singleExpression(0);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public boolean sempred(RuleContext _localctx, int ruleIndex, int predIndex) {
		switch (ruleIndex) {
		case 19:
			return expressionStatement_sempred((ExpressionStatementContext)_localctx, predIndex);
		case 21:
			return iterationStatement_sempred((IterationStatementContext)_localctx, predIndex);
		case 23:
			return continueStatement_sempred((ContinueStatementContext)_localctx, predIndex);
		case 24:
			return breakStatement_sempred((BreakStatementContext)_localctx, predIndex);
		case 25:
			return returnStatement_sempred((ReturnStatementContext)_localctx, predIndex);
		case 33:
			return throwStatement_sempred((ThrowStatementContext)_localctx, predIndex);
		case 42:
			return classElement_sempred((ClassElementContext)_localctx, predIndex);
		case 57:
			return singleExpression_sempred((SingleExpressionContext)_localctx, predIndex);
		case 67:
			return getter_sempred((GetterContext)_localctx, predIndex);
		case 68:
			return setter_sempred((SetterContext)_localctx, predIndex);
		case 73:
			return eos_sempred((EosContext)_localctx, predIndex);
		}
		return true;
	}
	private boolean expressionStatement_sempred(ExpressionStatementContext _localctx, int predIndex) {
		switch (predIndex) {
		case 0:
			return this.notOpenBraceAndNotFunction();
		}
		return true;
	}
	private boolean iterationStatement_sempred(IterationStatementContext _localctx, int predIndex) {
		switch (predIndex) {
		case 1:
			return this.p("of");
		}
		return true;
	}
	private boolean continueStatement_sempred(ContinueStatementContext _localctx, int predIndex) {
		switch (predIndex) {
		case 2:
			return this.notLineTerminator();
		}
		return true;
	}
	private boolean breakStatement_sempred(BreakStatementContext _localctx, int predIndex) {
		switch (predIndex) {
		case 3:
			return this.notLineTerminator();
		}
		return true;
	}
	private boolean returnStatement_sempred(ReturnStatementContext _localctx, int predIndex) {
		switch (predIndex) {
		case 4:
			return this.notLineTerminator();
		}
		return true;
	}
	private boolean throwStatement_sempred(ThrowStatementContext _localctx, int predIndex) {
		switch (predIndex) {
		case 5:
			return this.notLineTerminator();
		}
		return true;
	}
	private boolean classElement_sempred(ClassElementContext _localctx, int predIndex) {
		switch (predIndex) {
		case 6:
			return this.n("static");
		}
		return true;
	}
	private boolean singleExpression_sempred(SingleExpressionContext _localctx, int predIndex) {
		switch (predIndex) {
		case 7:
			return this.notLineTerminator();
		case 8:
			return precpred(_ctx, 28);
		case 9:
			return precpred(_ctx, 27);
		case 10:
			return precpred(_ctx, 26);
		case 11:
			return precpred(_ctx, 25);
		case 12:
			return precpred(_ctx, 24);
		case 13:
			return precpred(_ctx, 23);
		case 14:
			return precpred(_ctx, 22);
		case 15:
			return precpred(_ctx, 21);
		case 16:
			return precpred(_ctx, 20);
		case 17:
			return precpred(_ctx, 19);
		case 18:
			return precpred(_ctx, 18);
		case 19:
			return precpred(_ctx, 17);
		case 20:
			return precpred(_ctx, 16);
		case 21:
			return precpred(_ctx, 15);
		case 22:
			return precpred(_ctx, 14);
		case 23:
			return precpred(_ctx, 13);
		case 24:
			return precpred(_ctx, 12);
		case 25:
			return precpred(_ctx, 47);
		case 26:
			return precpred(_ctx, 45);
		case 27:
			return precpred(_ctx, 41);
		case 28:
			return precpred(_ctx, 40);
		case 29:
			return this.notLineTerminator();
		case 30:
			return precpred(_ctx, 39);
		case 31:
			return this.notLineTerminator();
		case 32:
			return precpred(_ctx, 10);
		}
		return true;
	}
	private boolean getter_sempred(GetterContext _localctx, int predIndex) {
		switch (predIndex) {
		case 33:
			return this.n("get");
		}
		return true;
	}
	private boolean setter_sempred(SetterContext _localctx, int predIndex) {
		switch (predIndex) {
		case 34:
			return this.n("set");
		}
		return true;
	}
	private boolean eos_sempred(EosContext _localctx, int predIndex) {
		switch (predIndex) {
		case 35:
			return this.lineTerminatorAhead();
		case 36:
			return this.closeBrace();
		}
		return true;
	}

	public static final String _serializedATN =
		"\3\u608b\ua72a\u8133\ub9ed\u417c\u3be7\u7786\u5964\3\u008a\u04a9\4\2\t"+
		"\2\4\3\t\3\4\4\t\4\4\5\t\5\4\6\t\6\4\7\t\7\4\b\t\b\4\t\t\t\4\n\t\n\4\13"+
		"\t\13\4\f\t\f\4\r\t\r\4\16\t\16\4\17\t\17\4\20\t\20\4\21\t\21\4\22\t\22"+
		"\4\23\t\23\4\24\t\24\4\25\t\25\4\26\t\26\4\27\t\27\4\30\t\30\4\31\t\31"+
		"\4\32\t\32\4\33\t\33\4\34\t\34\4\35\t\35\4\36\t\36\4\37\t\37\4 \t \4!"+
		"\t!\4\"\t\"\4#\t#\4$\t$\4%\t%\4&\t&\4\'\t\'\4(\t(\4)\t)\4*\t*\4+\t+\4"+
		",\t,\4-\t-\4.\t.\4/\t/\4\60\t\60\4\61\t\61\4\62\t\62\4\63\t\63\4\64\t"+
		"\64\4\65\t\65\4\66\t\66\4\67\t\67\48\t8\49\t9\4:\t:\4;\t;\4<\t<\4=\t="+
		"\4>\t>\4?\t?\4@\t@\4A\tA\4B\tB\4C\tC\4D\tD\4E\tE\4F\tF\4G\tG\4H\tH\4I"+
		"\tI\4J\tJ\4K\tK\4L\tL\4M\tM\4N\tN\4O\tO\4P\tP\4Q\tQ\4R\tR\4S\tS\4T\tT"+
		"\4U\tU\4V\tV\4W\tW\4X\tX\4Y\tY\4Z\tZ\4[\t[\4\\\t\\\4]\t]\4^\t^\3\2\5\2"+
		"\u00be\n\2\3\2\5\2\u00c1\n\2\3\2\3\2\3\3\3\3\3\4\3\4\3\4\3\4\3\4\3\4\3"+
		"\4\3\4\3\4\3\4\3\4\3\4\3\4\3\4\3\4\3\4\3\4\3\4\3\4\3\4\5\4\u00db\n\4\3"+
		"\5\3\5\5\5\u00df\n\5\3\5\3\5\3\6\6\6\u00e4\n\6\r\6\16\6\u00e5\3\7\3\7"+
		"\3\7\3\b\3\b\3\b\3\b\3\b\3\b\5\b\u00f1\n\b\3\b\3\b\3\b\3\b\3\b\3\b\5\b"+
		"\u00f9\n\b\3\b\3\b\5\b\u00fd\n\b\3\b\3\b\3\b\5\b\u0102\n\b\3\t\3\t\3\t"+
		"\3\t\7\t\u0108\n\t\f\t\16\t\u010b\13\t\3\t\3\t\5\t\u010f\n\t\5\t\u0111"+
		"\n\t\3\t\3\t\3\n\3\n\3\13\3\13\5\13\u0119\n\13\3\13\3\13\5\13\u011d\n"+
		"\13\3\f\3\f\3\f\3\r\3\r\3\r\5\r\u0125\n\r\3\16\3\16\3\16\5\16\u012a\n"+
		"\16\3\16\3\16\3\16\3\16\3\16\3\16\3\16\5\16\u0133\n\16\3\16\3\16\5\16"+
		"\u0137\n\16\3\17\3\17\3\17\3\17\3\17\3\17\5\17\u013f\n\17\3\17\3\17\5"+
		"\17\u0143\n\17\3\20\3\20\3\20\5\20\u0148\n\20\3\21\3\21\3\21\3\22\3\22"+
		"\3\22\3\22\7\22\u0151\n\22\f\22\16\22\u0154\13\22\3\23\3\23\3\23\5\23"+
		"\u0159\n\23\3\24\3\24\3\25\3\25\3\25\3\25\3\26\3\26\3\26\3\26\3\26\3\26"+
		"\3\26\5\26\u0168\n\26\3\27\3\27\3\27\3\27\3\27\3\27\3\27\3\27\3\27\3\27"+
		"\3\27\3\27\3\27\3\27\3\27\3\27\3\27\3\27\5\27\u017c\n\27\3\27\3\27\5\27"+
		"\u0180\n\27\3\27\3\27\5\27\u0184\n\27\3\27\3\27\3\27\3\27\3\27\3\27\5"+
		"\27\u018c\n\27\3\27\3\27\3\27\3\27\3\27\3\27\3\27\5\27\u0195\n\27\3\27"+
		"\3\27\3\27\5\27\u019a\n\27\3\27\3\27\3\27\3\27\3\27\3\27\5\27\u01a2\n"+
		"\27\3\30\3\30\3\31\3\31\3\31\5\31\u01a9\n\31\3\31\3\31\3\32\3\32\3\32"+
		"\5\32\u01b0\n\32\3\32\3\32\3\33\3\33\3\33\5\33\u01b7\n\33\3\33\3\33\3"+
		"\34\3\34\3\34\3\34\3\34\3\34\3\35\3\35\3\35\3\35\3\35\3\35\3\36\3\36\5"+
		"\36\u01c9\n\36\3\36\3\36\5\36\u01cd\n\36\5\36\u01cf\n\36\3\36\3\36\3\37"+
		"\6\37\u01d4\n\37\r\37\16\37\u01d5\3 \3 \3 \3 \5 \u01dc\n \3!\3!\3!\5!"+
		"\u01e1\n!\3\"\3\"\3\"\3\"\3#\3#\3#\3#\3#\3$\3$\3$\3$\5$\u01f0\n$\3$\5"+
		"$\u01f3\n$\3%\3%\3%\5%\u01f8\n%\3%\5%\u01fb\n%\3%\3%\3&\3&\3&\3\'\3\'"+
		"\3\'\3(\5(\u0206\n(\3(\3(\5(\u020a\n(\3(\3(\3(\5(\u020f\n(\3(\3(\3(\3"+
		"(\3(\3)\3)\3)\3)\3*\5*\u021b\n*\3*\3*\7*\u021f\n*\f*\16*\u0222\13*\3*"+
		"\3*\3+\3+\3+\3,\3,\3,\3,\7,\u022d\n,\f,\16,\u0230\13,\3,\3,\3,\5,\u0235"+
		"\n,\3,\3,\3,\3,\5,\u023b\n,\3-\5-\u023e\n-\3-\5-\u0241\n-\3-\3-\3-\5-"+
		"\u0246\n-\3-\3-\3-\3-\3-\3-\5-\u024e\n-\3-\5-\u0251\n-\3-\3-\3-\3-\3-"+
		"\3-\3-\3-\5-\u025b\n-\3-\5-\u025e\n-\3-\3-\3-\5-\u0263\n-\3-\3-\3-\3-"+
		"\3-\5-\u026a\n-\3.\3.\3.\7.\u026f\n.\f.\16.\u0272\13.\3.\3.\5.\u0276\n"+
		".\5.\u0278\n.\3.\5.\u027b\n.\3/\3/\3/\5/\u0280\n/\3\60\3\60\3\60\3\61"+
		"\5\61\u0286\n\61\3\62\6\62\u0289\n\62\r\62\16\62\u028a\3\63\3\63\3\63"+
		"\3\63\3\64\7\64\u0292\n\64\f\64\16\64\u0295\13\64\3\64\5\64\u0298\n\64"+
		"\3\64\6\64\u029b\n\64\r\64\16\64\u029c\3\64\7\64\u02a0\n\64\f\64\16\64"+
		"\u02a3\13\64\3\64\7\64\u02a6\n\64\f\64\16\64\u02a9\13\64\3\65\5\65\u02ac"+
		"\n\65\3\65\3\65\3\66\3\66\3\66\3\66\3\66\3\66\3\66\3\66\3\66\3\66\3\66"+
		"\5\66\u02bb\n\66\3\66\5\66\u02be\n\66\3\66\3\66\3\66\5\66\u02c3\n\66\3"+
		"\66\3\66\3\66\3\66\3\66\3\66\3\66\3\66\3\66\3\66\3\66\3\66\3\66\3\66\3"+
		"\66\3\66\3\66\3\66\3\66\3\66\3\66\5\66\u02da\n\66\3\66\5\66\u02dd\n\66"+
		"\3\67\3\67\3\67\3\67\3\67\3\67\3\67\5\67\u02e6\n\67\38\38\38\38\78\u02ec"+
		"\n8\f8\168\u02ef\138\38\58\u02f2\n8\58\u02f4\n8\38\38\39\59\u02f9\n9\3"+
		"9\39\59\u02fd\n9\3:\3:\3:\7:\u0302\n:\f:\16:\u0305\13:\3;\3;\3;\3;\5;"+
		"\u030b\n;\3;\3;\3;\3;\3;\3;\3;\3;\3;\3;\3;\3;\3;\3;\5;\u031b\n;\3;\3;"+
		"\3;\3;\3;\3;\3;\3;\3;\3;\3;\3;\3;\3;\3;\3;\3;\3;\3;\3;\3;\3;\3;\3;\3;"+
		"\3;\3;\3;\3;\3;\3;\3;\5;\u033d\n;\3;\5;\u0340\n;\3;\3;\3;\3;\3;\3;\3;"+
		"\3;\3;\3;\5;\u034c\n;\3;\3;\3;\3;\3;\3;\3;\3;\3;\3;\3;\3;\3;\3;\3;\3;"+
		"\3;\3;\3;\3;\3;\3;\3;\3;\3;\3;\3;\3;\3;\3;\3;\3;\3;\3;\3;\3;\3;\3;\3;"+
		"\3;\3;\3;\3;\3;\3;\3;\3;\3;\3;\3;\3;\3;\3;\3;\3;\3;\3;\3;\3;\3;\3;\3;"+
		"\5;\u038c\n;\3;\3;\5;\u0390\n;\3;\3;\3;\3;\3;\3;\3;\3;\3;\3;\3;\7;\u039d"+
		"\n;\f;\16;\u03a0\13;\3<\3<\3<\5<\u03a5\n<\3=\3=\3=\3=\7=\u03ab\n=\f=\16"+
		"=\u03ae\13=\5=\u03b0\n=\3=\5=\u03b3\n=\3=\3=\3>\3>\5>\u03b9\n>\3>\3>\5"+
		">\u03bd\n>\3>\3>\5>\u03c1\n>\3>\3>\3>\3>\3>\3>\5>\u03c9\n>\3>\3>\3>\3"+
		">\5>\u03cf\n>\3?\3?\3?\5?\u03d4\n?\3?\5?\u03d7\n?\3@\3@\3@\3@\3@\5@\u03de"+
		"\n@\3A\3A\3B\3B\3B\3B\3B\3B\3B\5B\u03e9\nB\3C\3C\3D\3D\3E\3E\3E\3E\3F"+
		"\3F\3F\3F\3G\3G\5G\u03f9\nG\3H\3H\3I\3I\3I\5I\u0400\nI\3J\3J\3K\3K\3K"+
		"\3K\5K\u0408\nK\3L\3L\3M\3M\3M\3M\3M\5M\u0411\nM\3M\7M\u0414\nM\fM\16"+
		"M\u0417\13M\3N\3N\5N\u041b\nN\3N\3N\3N\3N\3N\5N\u0422\nN\3O\5O\u0425\n"+
		"O\3O\3O\3O\5O\u042a\nO\3O\5O\u042d\nO\3O\5O\u0430\nO\3O\5O\u0433\nO\3"+
		"P\3P\3P\7P\u0438\nP\fP\16P\u043b\13P\3Q\3Q\3Q\3Q\5Q\u0441\nQ\3Q\3Q\3Q"+
		"\3Q\5Q\u0447\nQ\5Q\u0449\nQ\3R\3R\3R\3S\3S\3S\3T\3T\3T\7T\u0454\nT\fT"+
		"\16T\u0457\13T\3U\3U\3U\3U\3U\5U\u045e\nU\3V\3V\5V\u0462\nV\3V\7V\u0465"+
		"\nV\fV\16V\u0468\13V\3W\3W\3W\3W\3W\3W\3W\3W\3W\5W\u0473\nW\3X\3X\3X\3"+
		"X\3X\3X\3X\3X\3X\5X\u047e\nX\3Y\3Y\3Y\3Y\5Y\u0484\nY\3Z\3Z\3Z\3[\3[\3"+
		"[\3\\\3\\\3\\\3\\\7\\\u0490\n\\\f\\\16\\\u0493\13\\\3]\3]\3]\3]\7]\u0499"+
		"\n]\f]\16]\u049c\13]\5]\u049e\n]\3]\5]\u04a1\n]\3]\3]\3^\3^\3^\3^\3^\2"+
		"\3t_\2\4\6\b\n\f\16\20\22\24\26\30\32\34\36 \"$&(*,.\60\62\64\668:<>@"+
		"BDFHJLNPRTVXZ\\^`bdfhjlnprtvxz|~\u0080\u0082\u0084\u0086\u0088\u008a\u008c"+
		"\u008e\u0090\u0092\u0094\u0096\u0098\u009a\u009c\u009e\u00a0\u00a2\u00a4"+
		"\u00a6\u00a8\u00aa\u00ac\u00ae\u00b0\u00b2\u00b4\u00b6\u00b8\u00ba\2\16"+
		"\5\2OOddii\3\2\32\34\3\2\26\27\3\2 \"\3\2#&\3\2\'*\3\2\60;\3\2?C\3\2D"+
		"G\5\2llzz\u0082\u0082\5\2Hmxx{\u0081\4\2\'\'))\2\u052f\2\u00bd\3\2\2\2"+
		"\4\u00c4\3\2\2\2\6\u00da\3\2\2\2\b\u00dc\3\2\2\2\n\u00e3\3\2\2\2\f\u00e7"+
		"\3\2\2\2\16\u0101\3\2\2\2\20\u0103\3\2\2\2\22\u0114\3\2\2\2\24\u0118\3"+
		"\2\2\2\26\u011e\3\2\2\2\30\u0121\3\2\2\2\32\u0136\3\2\2\2\34\u0142\3\2"+
		"\2\2\36\u0147\3\2\2\2 \u0149\3\2\2\2\"\u014c\3\2\2\2$\u0155\3\2\2\2&\u015a"+
		"\3\2\2\2(\u015c\3\2\2\2*\u0160\3\2\2\2,\u01a1\3\2\2\2.\u01a3\3\2\2\2\60"+
		"\u01a5\3\2\2\2\62\u01ac\3\2\2\2\64\u01b3\3\2\2\2\66\u01ba\3\2\2\28\u01c0"+
		"\3\2\2\2:\u01c6\3\2\2\2<\u01d3\3\2\2\2>\u01d7\3\2\2\2@\u01dd\3\2\2\2B"+
		"\u01e2\3\2\2\2D\u01e6\3\2\2\2F\u01eb\3\2\2\2H\u01f4\3\2\2\2J\u01fe\3\2"+
		"\2\2L\u0201\3\2\2\2N\u0205\3\2\2\2P\u0215\3\2\2\2R\u021a\3\2\2\2T\u0225"+
		"\3\2\2\2V\u023a\3\2\2\2X\u0269\3\2\2\2Z\u027a\3\2\2\2\\\u027c\3\2\2\2"+
		"^\u0281\3\2\2\2`\u0285\3\2\2\2b\u0288\3\2\2\2d\u028c\3\2\2\2f\u0293\3"+
		"\2\2\2h\u02ab\3\2\2\2j\u02dc\3\2\2\2l\u02e5\3\2\2\2n\u02e7\3\2\2\2p\u02f8"+
		"\3\2\2\2r\u02fe\3\2\2\2t\u034b\3\2\2\2v\u03a4\3\2\2\2x\u03a6\3\2\2\2z"+
		"\u03ce\3\2\2\2|\u03d6\3\2\2\2~\u03dd\3\2\2\2\u0080\u03df\3\2\2\2\u0082"+
		"\u03e8\3\2\2\2\u0084\u03ea\3\2\2\2\u0086\u03ec\3\2\2\2\u0088\u03ee\3\2"+
		"\2\2\u008a\u03f2\3\2\2\2\u008c\u03f8\3\2\2\2\u008e\u03fa\3\2\2\2\u0090"+
		"\u03ff\3\2\2\2\u0092\u0401\3\2\2\2\u0094\u0407\3\2\2\2\u0096\u0409\3\2"+
		"\2\2\u0098\u0410\3\2\2\2\u009a\u0418\3\2\2\2\u009c\u0424\3\2\2\2\u009e"+
		"\u0434\3\2\2\2\u00a0\u0448\3\2\2\2\u00a2\u044a\3\2\2\2\u00a4\u044d\3\2"+
		"\2\2\u00a6\u0450\3\2\2\2\u00a8\u045d\3\2\2\2\u00aa\u045f\3\2\2\2\u00ac"+
		"\u0472\3\2\2\2\u00ae\u047d\3\2\2\2\u00b0\u0483\3\2\2\2\u00b2\u0485\3\2"+
		"\2\2\u00b4\u0488\3\2\2\2\u00b6\u048b\3\2\2\2\u00b8\u0494\3\2\2\2\u00ba"+
		"\u04a4\3\2\2\2\u00bc\u00be\7\3\2\2\u00bd\u00bc\3\2\2\2\u00bd\u00be\3\2"+
		"\2\2\u00be\u00c0\3\2\2\2\u00bf\u00c1\5b\62\2\u00c0\u00bf\3\2\2\2\u00c0"+
		"\u00c1\3\2\2\2\u00c1\u00c2\3\2\2\2\u00c2\u00c3\7\2\2\3\u00c3\3\3\2\2\2"+
		"\u00c4\u00c5\5\6\4\2\u00c5\5\3\2\2\2\u00c6\u00db\5\b\5\2\u00c7\u00db\5"+
		"\u0096L\2\u00c8\u00db\5 \21\2\u00c9\u00db\5\f\7\2\u00ca\u00db\5\32\16"+
		"\2\u00cb\u00db\5&\24\2\u00cc\u00db\5P)\2\u00cd\u00db\5N(\2\u00ce\u00db"+
		"\5(\25\2\u00cf\u00db\5*\26\2\u00d0\u00db\5,\27\2\u00d1\u00db\5\60\31\2"+
		"\u00d2\u00db\5\62\32\2\u00d3\u00db\5\64\33\2\u00d4\u00db\5\66\34\2\u00d5"+
		"\u00db\5B\"\2\u00d6\u00db\58\35\2\u00d7\u00db\5D#\2\u00d8\u00db\5F$\2"+
		"\u00d9\u00db\5L\'\2\u00da\u00c6\3\2\2\2\u00da\u00c7\3\2\2\2\u00da\u00c8"+
		"\3\2\2\2\u00da\u00c9\3\2\2\2\u00da\u00ca\3\2\2\2\u00da\u00cb\3\2\2\2\u00da"+
		"\u00cc\3\2\2\2\u00da\u00cd\3\2\2\2\u00da\u00ce\3\2\2\2\u00da\u00cf\3\2"+
		"\2\2\u00da\u00d0\3\2\2\2\u00da\u00d1\3\2\2\2\u00da\u00d2\3\2\2\2\u00da"+
		"\u00d3\3\2\2\2\u00da\u00d4\3\2\2\2\u00da\u00d5\3\2\2\2\u00da\u00d6\3\2"+
		"\2\2\u00da\u00d7\3\2\2\2\u00da\u00d8\3\2\2\2\u00da\u00d9\3\2\2\2\u00db"+
		"\7\3\2\2\2\u00dc\u00de\7\13\2\2\u00dd\u00df\5\n\6\2\u00de\u00dd\3\2\2"+
		"\2\u00de\u00df\3\2\2\2\u00df\u00e0\3\2\2\2\u00e0\u00e1\7\f\2\2\u00e1\t"+
		"\3\2\2\2\u00e2\u00e4\5\6\4\2\u00e3\u00e2\3\2\2\2\u00e4\u00e5\3\2\2\2\u00e5"+
		"\u00e3\3\2\2\2\u00e5\u00e6\3\2\2\2\u00e6\13\3\2\2\2\u00e7\u00e8\7k\2\2"+
		"\u00e8\u00e9\5\16\b\2\u00e9\r\3\2\2\2\u00ea\u00eb\7\u0083\2\2\u00eb\u0102"+
		"\5\u0094K\2\u00ec\u00ed\5\22\n\2\u00ed\u00f0\7\16\2\2\u00ee\u00f1\5\24"+
		"\13\2\u00ef\u00f1\5\20\t\2\u00f0\u00ee\3\2\2\2\u00f0\u00ef\3\2\2\2\u00f1"+
		"\u00f2\3\2\2\2\u00f2\u00f3\5\26\f\2\u00f3\u00f4\5\u0094K\2\u00f4\u0102"+
		"\3\2\2\2\u00f5\u00f6\5\22\n\2\u00f6\u00f7\7\16\2\2\u00f7\u00f9\3\2\2\2"+
		"\u00f8\u00f5\3\2\2\2\u00f8\u00f9\3\2\2\2\u00f9\u00fc\3\2\2\2\u00fa\u00fd"+
		"\5\24\13\2\u00fb\u00fd\5\20\t\2\u00fc\u00fa\3\2\2\2\u00fc\u00fb\3\2\2"+
		"\2\u00fd\u00fe\3\2\2\2\u00fe\u00ff\5\26\f\2\u00ff\u0100\5\u0094K\2\u0100"+
		"\u0102\3\2\2\2\u0101\u00ea\3\2\2\2\u0101\u00ec\3\2\2\2\u0101\u00f8\3\2"+
		"\2\2\u0102\17\3\2\2\2\u0103\u0109\7\13\2\2\u0104\u0105\5\30\r\2\u0105"+
		"\u0106\7\16\2\2\u0106\u0108\3\2\2\2\u0107\u0104\3\2\2\2\u0108\u010b\3"+
		"\2\2\2\u0109\u0107\3\2\2\2\u0109\u010a\3\2\2\2\u010a\u0110\3\2\2\2\u010b"+
		"\u0109\3\2\2\2\u010c\u010e\5\30\r\2\u010d\u010f\7\16\2\2\u010e\u010d\3"+
		"\2\2\2\u010e\u010f\3\2\2\2\u010f\u0111\3\2\2\2\u0110\u010c\3\2\2\2\u0110"+
		"\u0111\3\2\2\2\u0111\u0112\3\2\2\2\u0112\u0113\7\f\2\2\u0113\21\3\2\2"+
		"\2\u0114\u0115\5\30\r\2\u0115\23\3\2\2\2\u0116\u0119\7\32\2\2\u0117\u0119"+
		"\5\u008cG\2\u0118\u0116\3\2\2\2\u0118\u0117\3\2\2\2\u0119\u011c\3\2\2"+
		"\2\u011a\u011b\7b\2\2\u011b\u011d\5\u008cG\2\u011c\u011a\3\2\2\2\u011c"+
		"\u011d\3\2\2\2\u011d\25\3\2\2\2\u011e\u011f\7c\2\2\u011f\u0120\7\u0083"+
		"\2\2\u0120\27\3\2\2\2\u0121\u0124\5\u008cG\2\u0122\u0123\7b\2\2\u0123"+
		"\u0125\5\u008cG\2\u0124\u0122\3\2\2\2\u0124\u0125\3\2\2\2\u0125\31\3\2"+
		"\2\2\u0126\u0129\7j\2\2\u0127\u012a\5\34\17\2\u0128\u012a\5\36\20\2\u0129"+
		"\u0127\3\2\2\2\u0129\u0128\3\2\2\2\u012a\u012b\3\2\2\2\u012b\u012c\5\u0094"+
		"K\2\u012c\u0137\3\2\2\2\u012d\u012e\7j\2\2\u012e\u0132\7\\\2\2\u012f\u0133"+
		"\5P)\2\u0130\u0133\5N(\2\u0131\u0133\5t;\2\u0132\u012f\3\2\2\2\u0132\u0130"+
		"\3\2\2\2\u0132\u0131\3\2\2\2\u0133\u0134\3\2\2\2\u0134\u0135\5\u0094K"+
		"\2\u0135\u0137\3\2\2\2\u0136\u0126\3\2\2\2\u0136\u012d\3\2\2\2\u0137\33"+
		"\3\2\2\2\u0138\u0139\5\24\13\2\u0139\u013a\5\26\f\2\u013a\u013b\5\u0094"+
		"K\2\u013b\u0143\3\2\2\2\u013c\u013e\5\20\t\2\u013d\u013f\5\26\f\2\u013e"+
		"\u013d\3\2\2\2\u013e\u013f\3\2\2\2\u013f\u0140\3\2\2\2\u0140\u0141\5\u0094"+
		"K\2\u0141\u0143\3\2\2\2\u0142\u0138\3\2\2\2\u0142\u013c\3\2\2\2\u0143"+
		"\35\3\2\2\2\u0144\u0148\5 \21\2\u0145\u0148\5P)\2\u0146\u0148\5N(\2\u0147"+
		"\u0144\3\2\2\2\u0147\u0145\3\2\2\2\u0147\u0146\3\2\2\2\u0148\37\3\2\2"+
		"\2\u0149\u014a\5\"\22\2\u014a\u014b\5\u0094K\2\u014b!\3\2\2\2\u014c\u014d"+
		"\5.\30\2\u014d\u0152\5$\23\2\u014e\u014f\7\16\2\2\u014f\u0151\5$\23\2"+
		"\u0150\u014e\3\2\2\2\u0151\u0154\3\2\2\2\u0152\u0150\3\2\2\2\u0152\u0153"+
		"\3\2\2\2\u0153#\3\2\2\2\u0154\u0152\3\2\2\2\u0155\u0158\5v<\2\u0156\u0157"+
		"\7\17\2\2\u0157\u0159\5t;\2\u0158\u0156\3\2\2\2\u0158\u0159\3\2\2\2\u0159"+
		"%\3\2\2\2\u015a\u015b\7\r\2\2\u015b\'\3\2\2\2\u015c\u015d\6\25\2\2\u015d"+
		"\u015e\5r:\2\u015e\u015f\5\u0094K\2\u015f)\3\2\2\2\u0160\u0161\7]\2\2"+
		"\u0161\u0162\7\t\2\2\u0162\u0163\5r:\2\u0163\u0164\7\n\2\2\u0164\u0167"+
		"\5\6\4\2\u0165\u0166\7M\2\2\u0166\u0168\5\6\4\2\u0167\u0165\3\2\2\2\u0167"+
		"\u0168\3\2\2\2\u0168+\3\2\2\2\u0169\u016a\7I\2\2\u016a\u016b\5\6\4\2\u016b"+
		"\u016c\7W\2\2\u016c\u016d\7\t\2\2\u016d\u016e\5r:\2\u016e\u016f\7\n\2"+
		"\2\u016f\u0170\5\u0094K\2\u0170\u01a2\3\2\2\2\u0171\u0172\7W\2\2\u0172"+
		"\u0173\7\t\2\2\u0173\u0174\5r:\2\u0174\u0175\7\n\2\2\u0175\u0176\5\6\4"+
		"\2\u0176\u01a2\3\2\2\2\u0177\u0178\7U\2\2\u0178\u017b\7\t\2\2\u0179\u017c"+
		"\5r:\2\u017a\u017c\5\"\22\2\u017b\u0179\3\2\2\2\u017b\u017a\3\2\2\2\u017b"+
		"\u017c\3\2\2\2\u017c\u017d\3\2\2\2\u017d\u017f\7\r\2\2\u017e\u0180\5r"+
		":\2\u017f\u017e\3\2\2\2\u017f\u0180\3\2\2\2\u0180\u0181\3\2\2\2\u0181"+
		"\u0183\7\r\2\2\u0182\u0184\5r:\2\u0183\u0182\3\2\2\2\u0183\u0184\3\2\2"+
		"\2\u0184\u0185\3\2\2\2\u0185\u0186\7\n\2\2\u0186\u01a2\5\6\4\2\u0187\u0188"+
		"\7U\2\2\u0188\u018b\7\t\2\2\u0189\u018c\5t;\2\u018a\u018c\5\"\22\2\u018b"+
		"\u0189\3\2\2\2\u018b\u018a\3\2\2\2\u018c\u018d\3\2\2\2\u018d\u018e\7`"+
		"\2\2\u018e\u018f\5r:\2\u018f\u0190\7\n\2\2\u0190\u0191\5\6\4\2\u0191\u01a2"+
		"\3\2\2\2\u0192\u0194\7U\2\2\u0193\u0195\7m\2\2\u0194\u0193\3\2\2\2\u0194"+
		"\u0195\3\2\2\2\u0195\u0196\3\2\2\2\u0196\u0199\7\t\2\2\u0197\u019a\5t"+
		";\2\u0198\u019a\5\"\22\2\u0199\u0197\3\2\2\2\u0199\u0198\3\2\2\2\u019a"+
		"\u019b\3\2\2\2\u019b\u019c\5\u008eH\2\u019c\u019d\6\27\3\2\u019d\u019e"+
		"\5r:\2\u019e\u019f\7\n\2\2\u019f\u01a0\5\6\4\2\u01a0\u01a2\3\2\2\2\u01a1"+
		"\u0169\3\2\2\2\u01a1\u0171\3\2\2\2\u01a1\u0177\3\2\2\2\u01a1\u0187\3\2"+
		"\2\2\u01a1\u0192\3\2\2\2\u01a2-\3\2\2\2\u01a3\u01a4\t\2\2\2\u01a4/\3\2"+
		"\2\2\u01a5\u01a8\7T\2\2\u01a6\u01a7\6\31\4\2\u01a7\u01a9\5\u008eH\2\u01a8"+
		"\u01a6\3\2\2\2\u01a8\u01a9\3\2\2\2\u01a9\u01aa\3\2\2\2\u01aa\u01ab\5\u0094"+
		"K\2\u01ab\61\3\2\2\2\u01ac\u01af\7H\2\2\u01ad\u01ae\6\32\5\2\u01ae\u01b0"+
		"\5\u008eH\2\u01af\u01ad\3\2\2\2\u01af\u01b0\3\2\2\2\u01b0\u01b1\3\2\2"+
		"\2\u01b1\u01b2\5\u0094K\2\u01b2\63\3\2\2\2\u01b3\u01b6\7R\2\2\u01b4\u01b5"+
		"\6\33\6\2\u01b5\u01b7\5r:\2\u01b6\u01b4\3\2\2\2\u01b6\u01b7\3\2\2\2\u01b7"+
		"\u01b8\3\2\2\2\u01b8\u01b9\5\u0094K\2\u01b9\65\3\2\2\2\u01ba\u01bb\7["+
		"\2\2\u01bb\u01bc\7\t\2\2\u01bc\u01bd\5r:\2\u01bd\u01be\7\n\2\2\u01be\u01bf"+
		"\5\6\4\2\u01bf\67\3\2\2\2\u01c0\u01c1\7V\2\2\u01c1\u01c2\7\t\2\2\u01c2"+
		"\u01c3\5r:\2\u01c3\u01c4\7\n\2\2\u01c4\u01c5\5:\36\2\u01c59\3\2\2\2\u01c6"+
		"\u01c8\7\13\2\2\u01c7\u01c9\5<\37\2\u01c8\u01c7\3\2\2\2\u01c8\u01c9\3"+
		"\2\2\2\u01c9\u01ce\3\2\2\2\u01ca\u01cc\5@!\2\u01cb\u01cd\5<\37\2\u01cc"+
		"\u01cb\3\2\2\2\u01cc\u01cd\3\2\2\2\u01cd\u01cf\3\2\2\2\u01ce\u01ca\3\2"+
		"\2\2\u01ce\u01cf\3\2\2\2\u01cf\u01d0\3\2\2\2\u01d0\u01d1\7\f\2\2\u01d1"+
		";\3\2\2\2\u01d2\u01d4\5> \2\u01d3\u01d2\3\2\2\2\u01d4\u01d5\3\2\2\2\u01d5"+
		"\u01d3\3\2\2\2\u01d5\u01d6\3\2\2\2\u01d6=\3\2\2\2\u01d7\u01d8\7L\2\2\u01d8"+
		"\u01d9\5r:\2\u01d9\u01db\7\21\2\2\u01da\u01dc\5\n\6\2\u01db\u01da\3\2"+
		"\2\2\u01db\u01dc\3\2\2\2\u01dc?\3\2\2\2\u01dd\u01de\7\\\2\2\u01de\u01e0"+
		"\7\21\2\2\u01df\u01e1\5\n\6\2\u01e0\u01df\3\2\2\2\u01e0\u01e1\3\2\2\2"+
		"\u01e1A\3\2\2\2\u01e2\u01e3\5\u008eH\2\u01e3\u01e4\7\21\2\2\u01e4\u01e5"+
		"\5\6\4\2\u01e5C\3\2\2\2\u01e6\u01e7\7^\2\2\u01e7\u01e8\6#\7\2\u01e8\u01e9"+
		"\5r:\2\u01e9\u01ea\5\u0094K\2\u01eaE\3\2\2\2\u01eb\u01ec\7a\2\2\u01ec"+
		"\u01f2\5\b\5\2\u01ed\u01ef\5H%\2\u01ee\u01f0\5J&\2\u01ef\u01ee\3\2\2\2"+
		"\u01ef\u01f0\3\2\2\2\u01f0\u01f3\3\2\2\2\u01f1\u01f3\5J&\2\u01f2\u01ed"+
		"\3\2\2\2\u01f2\u01f1\3\2\2\2\u01f3G\3\2\2\2\u01f4\u01fa\7P\2\2\u01f5\u01f7"+
		"\7\t\2\2\u01f6\u01f8\5v<\2\u01f7\u01f6\3\2\2\2\u01f7\u01f8\3\2\2\2\u01f8"+
		"\u01f9\3\2\2\2\u01f9\u01fb\7\n\2\2\u01fa\u01f5\3\2\2\2\u01fa\u01fb\3\2"+
		"\2\2\u01fb\u01fc\3\2\2\2\u01fc\u01fd\5\b\5\2\u01fdI\3\2\2\2\u01fe\u01ff"+
		"\7Q\2\2\u01ff\u0200\5\b\5\2\u0200K\3\2\2\2\u0201\u0202\7X\2\2\u0202\u0203"+
		"\5\u0094K\2\u0203M\3\2\2\2\u0204\u0206\7l\2\2\u0205\u0204\3\2\2\2\u0205"+
		"\u0206\3\2\2\2\u0206\u0207\3\2\2\2\u0207\u0209\7Y\2\2\u0208\u020a\7\32"+
		"\2\2\u0209\u0208\3\2\2\2\u0209\u020a\3\2\2\2\u020a\u020b\3\2\2\2\u020b"+
		"\u020c\5\u008eH\2\u020c\u020e\7\t\2\2\u020d\u020f\5Z.\2\u020e\u020d\3"+
		"\2\2\2\u020e\u020f\3\2\2\2\u020f\u0210\3\2\2\2\u0210\u0211\7\n\2\2\u0211"+
		"\u0212\7\13\2\2\u0212\u0213\5`\61\2\u0213\u0214\7\f\2\2\u0214O\3\2\2\2"+
		"\u0215\u0216\7e\2\2\u0216\u0217\5\u008eH\2\u0217\u0218\5R*\2\u0218Q\3"+
		"\2\2\2\u0219\u021b\5T+\2\u021a\u0219\3\2\2\2\u021a\u021b\3\2\2\2\u021b"+
		"\u021c\3\2\2\2\u021c\u0220\7\13\2\2\u021d\u021f\5V,\2\u021e\u021d\3\2"+
		"\2\2\u021f\u0222\3\2\2\2\u0220\u021e\3\2\2\2\u0220\u0221\3\2\2\2\u0221"+
		"\u0223\3\2\2\2\u0222\u0220\3\2\2\2\u0223\u0224\7\f\2\2\u0224S\3\2\2\2"+
		"\u0225\u0226\7g\2\2\u0226\u0227\5t;\2\u0227U\3\2\2\2\u0228\u022d\7\u0080"+
		"\2\2\u0229\u022a\6,\b\2\u022a\u022d\5\u008eH\2\u022b\u022d\7l\2\2\u022c"+
		"\u0228\3\2\2\2\u022c\u0229\3\2\2\2\u022c\u022b\3\2\2\2\u022d\u0230\3\2"+
		"\2\2\u022e\u022c\3\2\2\2\u022e\u022f\3\2\2\2\u022f\u0231\3\2\2\2\u0230"+
		"\u022e\3\2\2\2\u0231\u023b\5X-\2\u0232\u023b\5&\24\2\u0233\u0235\7\37"+
		"\2\2\u0234\u0233\3\2\2\2\u0234\u0235\3\2\2\2\u0235\u0236\3\2\2\2\u0236"+
		"\u0237\5l\67\2\u0237\u0238\7\17\2\2\u0238\u0239\5t;\2\u0239\u023b\3\2"+
		"\2\2\u023a\u022e\3\2\2\2\u023a\u0232\3\2\2\2\u023a\u0234\3\2\2\2\u023b"+
		"W\3\2\2\2\u023c\u023e\7\32\2\2\u023d\u023c\3\2\2\2\u023d\u023e\3\2\2\2"+
		"\u023e\u0240\3\2\2\2\u023f\u0241\7\37\2\2\u0240\u023f\3\2\2\2\u0240\u0241"+
		"\3\2\2\2\u0241\u0242\3\2\2\2\u0242\u0243\5l\67\2\u0243\u0245\7\t\2\2\u0244"+
		"\u0246\5Z.\2\u0245\u0244\3\2\2\2\u0245\u0246\3\2\2\2\u0246\u0247\3\2\2"+
		"\2\u0247\u0248\7\n\2\2\u0248\u0249\7\13\2\2\u0249\u024a\5`\61\2\u024a"+
		"\u024b\7\f\2\2\u024b\u026a\3\2\2\2\u024c\u024e\7\32\2\2\u024d\u024c\3"+
		"\2\2\2\u024d\u024e\3\2\2\2\u024e\u0250\3\2\2\2\u024f\u0251\7\37\2\2\u0250"+
		"\u024f\3\2\2\2\u0250\u0251\3\2\2\2\u0251\u0252\3\2\2\2\u0252\u0253\5\u0088"+
		"E\2\u0253\u0254\7\t\2\2\u0254\u0255\7\n\2\2\u0255\u0256\7\13\2\2\u0256"+
		"\u0257\5`\61\2\u0257\u0258\7\f\2\2\u0258\u026a\3\2\2\2\u0259\u025b\7\32"+
		"\2\2\u025a\u0259\3\2\2\2\u025a\u025b\3\2\2\2\u025b\u025d\3\2\2\2\u025c"+
		"\u025e\7\37\2\2\u025d\u025c\3\2\2\2\u025d\u025e\3\2\2\2\u025e\u025f\3"+
		"\2\2\2\u025f\u0260\5\u008aF\2\u0260\u0262\7\t\2\2\u0261\u0263\5Z.\2\u0262"+
		"\u0261\3\2\2\2\u0262\u0263\3\2\2\2\u0263\u0264\3\2\2\2\u0264\u0265\7\n"+
		"\2\2\u0265\u0266\7\13\2\2\u0266\u0267\5`\61\2\u0267\u0268\7\f\2\2\u0268"+
		"\u026a\3\2\2\2\u0269\u023d\3\2\2\2\u0269\u024d\3\2\2\2\u0269\u025a\3\2"+
		"\2\2\u026aY\3\2\2\2\u026b\u0270\5\\/\2\u026c\u026d\7\16\2\2\u026d\u026f"+
		"\5\\/\2\u026e\u026c\3\2\2\2\u026f\u0272\3\2\2\2\u0270\u026e\3\2\2\2\u0270"+
		"\u0271\3\2\2\2\u0271\u0277\3\2\2\2\u0272\u0270\3\2\2\2\u0273\u0275\7\16"+
		"\2\2\u0274\u0276\5^\60\2\u0275\u0274\3\2\2\2\u0275\u0276\3\2\2\2\u0276"+
		"\u0278\3\2\2\2\u0277\u0273\3\2\2\2\u0277\u0278\3\2\2\2\u0278\u027b\3\2"+
		"\2\2\u0279\u027b\5^\60\2\u027a\u026b\3\2\2\2\u027a\u0279\3\2\2\2\u027b"+
		"[\3\2\2\2\u027c\u027f\5v<\2\u027d\u027e\7\17\2\2\u027e\u0280\5t;\2\u027f"+
		"\u027d\3\2\2\2\u027f\u0280\3\2\2\2\u0280]\3\2\2\2\u0281\u0282\7\22\2\2"+
		"\u0282\u0283\5t;\2\u0283_\3\2\2\2\u0284\u0286\5b\62\2\u0285\u0284\3\2"+
		"\2\2\u0285\u0286\3\2\2\2\u0286a\3\2\2\2\u0287\u0289\5\4\3\2\u0288\u0287"+
		"\3\2\2\2\u0289\u028a\3\2\2\2\u028a\u0288\3\2\2\2\u028a\u028b\3\2\2\2\u028b"+
		"c\3\2\2\2\u028c\u028d\7\7\2\2\u028d\u028e\5f\64\2\u028e\u028f\7\b\2\2"+
		"\u028fe\3\2\2\2\u0290\u0292\7\16\2\2\u0291\u0290\3\2\2\2\u0292\u0295\3"+
		"\2\2\2\u0293\u0291\3\2\2\2\u0293\u0294\3\2\2\2\u0294\u0297\3\2\2\2\u0295"+
		"\u0293\3\2\2\2\u0296\u0298\5h\65\2\u0297\u0296\3\2\2\2\u0297\u0298\3\2"+
		"\2\2\u0298\u02a1\3\2\2\2\u0299\u029b\7\16\2\2\u029a\u0299\3\2\2\2\u029b"+
		"\u029c\3\2\2\2\u029c\u029a\3\2\2\2\u029c\u029d\3\2\2\2\u029d\u029e\3\2"+
		"\2\2\u029e\u02a0\5h\65\2\u029f\u029a\3\2\2\2\u02a0\u02a3\3\2\2\2\u02a1"+
		"\u029f\3\2\2\2\u02a1\u02a2\3\2\2\2\u02a2\u02a7\3\2\2\2\u02a3\u02a1\3\2"+
		"\2\2\u02a4\u02a6\7\16\2\2\u02a5\u02a4\3\2\2\2\u02a6\u02a9\3\2\2\2\u02a7"+
		"\u02a5\3\2\2\2\u02a7\u02a8\3\2\2\2\u02a8g\3\2\2\2\u02a9\u02a7\3\2\2\2"+
		"\u02aa\u02ac\7\22\2\2\u02ab\u02aa\3\2\2\2\u02ab\u02ac\3\2\2\2\u02ac\u02ad"+
		"\3\2\2\2\u02ad\u02ae\5t;\2\u02aei\3\2\2\2\u02af\u02b0\5l\67\2\u02b0\u02b1"+
		"\7\21\2\2\u02b1\u02b2\5t;\2\u02b2\u02dd\3\2\2\2\u02b3\u02b4\7\7\2\2\u02b4"+
		"\u02b5\5t;\2\u02b5\u02b6\7\b\2\2\u02b6\u02b7\7\21\2\2\u02b7\u02b8\5t;"+
		"\2\u02b8\u02dd\3\2\2\2\u02b9\u02bb\7l\2\2\u02ba\u02b9\3\2\2\2\u02ba\u02bb"+
		"\3\2\2\2\u02bb\u02bd\3\2\2\2\u02bc\u02be\7\32\2\2\u02bd\u02bc\3\2\2\2"+
		"\u02bd\u02be\3\2\2\2\u02be\u02bf\3\2\2\2\u02bf\u02c0\5l\67\2\u02c0\u02c2"+
		"\7\t\2\2\u02c1\u02c3\5Z.\2\u02c2\u02c1\3\2\2\2\u02c2\u02c3\3\2\2\2\u02c3"+
		"\u02c4\3\2\2\2\u02c4\u02c5\7\n\2\2\u02c5\u02c6\7\13\2\2\u02c6\u02c7\5"+
		"`\61\2\u02c7\u02c8\7\f\2\2\u02c8\u02dd\3\2\2\2\u02c9\u02ca\5\u0088E\2"+
		"\u02ca\u02cb\7\t\2\2\u02cb\u02cc\7\n\2\2\u02cc\u02cd\7\13\2\2\u02cd\u02ce"+
		"\5`\61\2\u02ce\u02cf\7\f\2\2\u02cf\u02dd\3\2\2\2\u02d0\u02d1\5\u008aF"+
		"\2\u02d1\u02d2\7\t\2\2\u02d2\u02d3\5\\/\2\u02d3\u02d4\7\n\2\2\u02d4\u02d5"+
		"\7\13\2\2\u02d5\u02d6\5`\61\2\u02d6\u02d7\7\f\2\2\u02d7\u02dd\3\2\2\2"+
		"\u02d8\u02da\7\22\2\2\u02d9\u02d8\3\2\2\2\u02d9\u02da\3\2\2\2\u02da\u02db"+
		"\3\2\2\2\u02db\u02dd\5t;\2\u02dc\u02af\3\2\2\2\u02dc\u02b3\3\2\2\2\u02dc"+
		"\u02ba\3\2\2\2\u02dc\u02c9\3\2\2\2\u02dc\u02d0\3\2\2\2\u02dc\u02d9\3\2"+
		"\2\2\u02ddk\3\2\2\2\u02de\u02e6\5\u008cG\2\u02df\u02e6\7\u0083\2\2\u02e0"+
		"\u02e6\5\u0084C\2\u02e1\u02e2\7\7\2\2\u02e2\u02e3\5t;\2\u02e3\u02e4\7"+
		"\b\2\2\u02e4\u02e6\3\2\2\2\u02e5\u02de\3\2\2\2\u02e5\u02df\3\2\2\2\u02e5"+
		"\u02e0\3\2\2\2\u02e5\u02e1\3\2\2\2\u02e6m\3\2\2\2\u02e7\u02f3\7\t\2\2"+
		"\u02e8\u02ed\5p9\2\u02e9\u02ea\7\16\2\2\u02ea\u02ec\5p9\2\u02eb\u02e9"+
		"\3\2\2\2\u02ec\u02ef\3\2\2\2\u02ed\u02eb\3\2\2\2\u02ed\u02ee\3\2\2\2\u02ee"+
		"\u02f1\3\2\2\2\u02ef\u02ed\3\2\2\2\u02f0\u02f2\7\16\2\2\u02f1\u02f0\3"+
		"\2\2\2\u02f1\u02f2\3\2\2\2\u02f2\u02f4\3\2\2\2\u02f3\u02e8\3\2\2\2\u02f3"+
		"\u02f4\3\2\2\2\u02f4\u02f5\3\2\2\2\u02f5\u02f6\7\n\2\2\u02f6o\3\2\2\2"+
		"\u02f7\u02f9\7\22\2\2\u02f8\u02f7\3\2\2\2\u02f8\u02f9\3\2\2\2\u02f9\u02fc"+
		"\3\2\2\2\u02fa\u02fd\5t;\2\u02fb\u02fd\5\u008eH\2\u02fc\u02fa\3\2\2\2"+
		"\u02fc\u02fb\3\2\2\2\u02fdq\3\2\2\2\u02fe\u0303\5t;\2\u02ff\u0300\7\16"+
		"\2\2\u0300\u0302\5t;\2\u0301\u02ff\3\2\2\2\u0302\u0305\3\2\2\2\u0303\u0301"+
		"\3\2\2\2\u0303\u0304\3\2\2\2\u0304s\3\2\2\2\u0305\u0303\3\2\2\2\u0306"+
		"\u0307\b;\1\2\u0307\u034c\5z>\2\u0308\u030a\7e\2\2\u0309\u030b\5\u008e"+
		"H\2\u030a\u0309\3\2\2\2\u030a\u030b\3\2\2\2\u030b\u030c\3\2\2\2\u030c"+
		"\u034c\5R*\2\u030d\u030e\7N\2\2\u030e\u030f\5t;\2\u030f\u0310\7\23\2\2"+
		"\u0310\u0311\5\u008cG\2\u0311\u0312\5n8\2\u0312\u034c\3\2\2\2\u0313\u0314"+
		"\7N\2\2\u0314\u0315\5t;\2\u0315\u0316\5n8\2\u0316\u034c\3\2\2\2\u0317"+
		"\u0318\7N\2\2\u0318\u031a\5t;\2\u0319\u031b\5n8\2\u031a\u0319\3\2\2\2"+
		"\u031a\u031b\3\2\2\2\u031b\u034c\3\2\2\2\u031c\u031d\7N\2\2\u031d\u031e"+
		"\7\23\2\2\u031e\u034c\5\u008eH\2\u031f\u0320\7_\2\2\u0320\u034c\5t;(\u0321"+
		"\u0322\7S\2\2\u0322\u034c\5t;\'\u0323\u0324\7K\2\2\u0324\u034c\5t;&\u0325"+
		"\u0326\7\24\2\2\u0326\u034c\5t;%\u0327\u0328\7\25\2\2\u0328\u034c\5t;"+
		"$\u0329\u032a\7\26\2\2\u032a\u034c\5t;#\u032b\u032c\7\27\2\2\u032c\u034c"+
		"\5t;\"\u032d\u032e\7\30\2\2\u032e\u034c\5t;!\u032f\u0330\7\31\2\2\u0330"+
		"\u034c\5t; \u0331\u0332\7m\2\2\u0332\u034c\5t;\37\u0333\u0334\7k\2\2\u0334"+
		"\u0335\7\t\2\2\u0335\u0336\5t;\2\u0336\u0337\7\n\2\2\u0337\u034c\3\2\2"+
		"\2\u0338\u034c\7Z\2\2\u0339\u033f\7\u0081\2\2\u033a\u033c\6;\t\2\u033b"+
		"\u033d\7\32\2\2\u033c\u033b\3\2\2\2\u033c\u033d\3\2\2\2\u033d\u033e\3"+
		"\2\2\2\u033e\u0340\5r:\2\u033f\u033a\3\2\2\2\u033f\u0340\3\2\2\2\u0340"+
		"\u034c\3\2\2\2\u0341\u034c\5\u008eH\2\u0342\u034c\7h\2\2\u0343\u034c\5"+
		"\u0082B\2\u0344\u034c\5d\63\2\u0345\u034c\5x=\2\u0346\u0347\7\t\2\2\u0347"+
		"\u0348\5r:\2\u0348\u0349\7\n\2\2\u0349\u034c\3\2\2\2\u034a\u034c\5\u0098"+
		"M\2\u034b\u0306\3\2\2\2\u034b\u0308\3\2\2\2\u034b\u030d\3\2\2\2\u034b"+
		"\u0313\3\2\2\2\u034b\u0317\3\2\2\2\u034b\u031c\3\2\2\2\u034b\u031f\3\2"+
		"\2\2\u034b\u0321\3\2\2\2\u034b\u0323\3\2\2\2\u034b\u0325\3\2\2\2\u034b"+
		"\u0327\3\2\2\2\u034b\u0329\3\2\2\2\u034b\u032b\3\2\2\2\u034b\u032d\3\2"+
		"\2\2\u034b\u032f\3\2\2\2\u034b\u0331\3\2\2\2\u034b\u0333\3\2\2\2\u034b"+
		"\u0338\3\2\2\2\u034b\u0339\3\2\2\2\u034b\u0341\3\2\2\2\u034b\u0342\3\2"+
		"\2\2\u034b\u0343\3\2\2\2\u034b\u0344\3\2\2\2\u034b\u0345\3\2\2\2\u034b"+
		"\u0346\3\2\2\2\u034b\u034a\3\2\2\2\u034c\u039e\3\2\2\2\u034d\u034e\f\36"+
		"\2\2\u034e\u034f\7\35\2\2\u034f\u039d\5t;\36\u0350\u0351\f\35\2\2\u0351"+
		"\u0352\t\3\2\2\u0352\u039d\5t;\36\u0353\u0354\f\34\2\2\u0354\u0355\t\4"+
		"\2\2\u0355\u039d\5t;\35\u0356\u0357\f\33\2\2\u0357\u0358\7\36\2\2\u0358"+
		"\u039d\5t;\34\u0359\u035a\f\32\2\2\u035a\u035b\t\5\2\2\u035b\u039d\5t"+
		";\33\u035c\u035d\f\31\2\2\u035d\u035e\t\6\2\2\u035e\u039d\5t;\32\u035f"+
		"\u0360\f\30\2\2\u0360\u0361\7J\2\2\u0361\u039d\5t;\31\u0362\u0363\f\27"+
		"\2\2\u0363\u0364\7`\2\2\u0364\u039d\5t;\30\u0365\u0366\f\26\2\2\u0366"+
		"\u0367\t\7\2\2\u0367\u039d\5t;\27\u0368\u0369\f\25\2\2\u0369\u036a\7+"+
		"\2\2\u036a\u039d\5t;\26\u036b\u036c\f\24\2\2\u036c\u036d\7,\2\2\u036d"+
		"\u039d\5t;\25\u036e\u036f\f\23\2\2\u036f\u0370\7-\2\2\u0370\u039d\5t;"+
		"\24\u0371\u0372\f\22\2\2\u0372\u0373\7.\2\2\u0373\u039d\5t;\23\u0374\u0375"+
		"\f\21\2\2\u0375\u0376\7/\2\2\u0376\u039d\5t;\22\u0377\u0378\f\20\2\2\u0378"+
		"\u0379\7\20\2\2\u0379\u037a\5t;\2\u037a\u037b\7\21\2\2\u037b\u037c\5t"+
		";\21\u037c\u039d\3\2\2\2\u037d\u037e\f\17\2\2\u037e\u037f\7\17\2\2\u037f"+
		"\u039d\5t;\17\u0380\u0381\f\16\2\2\u0381\u0382\5\u0080A\2\u0382\u0383"+
		"\5t;\16\u0383\u039d\3\2\2\2\u0384\u0385\f\61\2\2\u0385\u0386\7\7\2\2\u0386"+
		"\u0387\5r:\2\u0387\u0388\7\b\2\2\u0388\u039d\3\2\2\2\u0389\u038b\f/\2"+
		"\2\u038a\u038c\7\20\2\2\u038b\u038a\3\2\2\2\u038b\u038c\3\2\2\2\u038c"+
		"\u038d\3\2\2\2\u038d\u038f\7\23\2\2\u038e\u0390\7\37\2\2\u038f\u038e\3"+
		"\2\2\2\u038f\u0390\3\2\2\2\u0390\u0391\3\2\2\2\u0391\u039d\5\u008cG\2"+
		"\u0392\u0393\f+\2\2\u0393\u039d\5n8\2\u0394\u0395\f*\2\2\u0395\u0396\6"+
		";\37\2\u0396\u039d\7\24\2\2\u0397\u0398\f)\2\2\u0398\u0399\6;!\2\u0399"+
		"\u039d\7\25\2\2\u039a\u039b\f\f\2\2\u039b\u039d\7\u0084\2\2\u039c\u034d"+
		"\3\2\2\2\u039c\u0350\3\2\2\2\u039c\u0353\3\2\2\2\u039c\u0356\3\2\2\2\u039c"+
		"\u0359\3\2\2\2\u039c\u035c\3\2\2\2\u039c\u035f\3\2\2\2\u039c\u0362\3\2"+
		"\2\2\u039c\u0365\3\2\2\2\u039c\u0368\3\2\2\2\u039c\u036b\3\2\2\2\u039c"+
		"\u036e\3\2\2\2\u039c\u0371\3\2\2\2\u039c\u0374\3\2\2\2\u039c\u0377\3\2"+
		"\2\2\u039c\u037d\3\2\2\2\u039c\u0380\3\2\2\2\u039c\u0384\3\2\2\2\u039c"+
		"\u0389\3\2\2\2\u039c\u0392\3\2\2\2\u039c\u0394\3\2\2\2\u039c\u0397\3\2"+
		"\2\2\u039c\u039a\3\2\2\2\u039d\u03a0\3\2\2\2\u039e\u039c\3\2\2\2\u039e"+
		"\u039f\3\2\2\2\u039fu\3\2\2\2\u03a0\u039e\3\2\2\2\u03a1\u03a5\5\u008e"+
		"H\2\u03a2\u03a5\5d\63\2\u03a3\u03a5\5x=\2\u03a4\u03a1\3\2\2\2\u03a4\u03a2"+
		"\3\2\2\2\u03a4\u03a3\3\2\2\2\u03a5w\3\2\2\2\u03a6\u03af\7\13\2\2\u03a7"+
		"\u03ac\5j\66\2\u03a8\u03a9\7\16\2\2\u03a9\u03ab\5j\66\2\u03aa\u03a8\3"+
		"\2\2\2\u03ab\u03ae\3\2\2\2\u03ac\u03aa\3\2\2\2\u03ac\u03ad\3\2\2\2\u03ad"+
		"\u03b0\3\2\2\2\u03ae\u03ac\3\2\2\2\u03af\u03a7\3\2\2\2\u03af\u03b0\3\2"+
		"\2\2\u03b0\u03b2\3\2\2\2\u03b1\u03b3\7\16\2\2\u03b2\u03b1\3\2\2\2\u03b2"+
		"\u03b3\3\2\2\2\u03b3\u03b4\3\2\2\2\u03b4\u03b5\7\f\2\2\u03b5y\3\2\2\2"+
		"\u03b6\u03cf\5N(\2\u03b7\u03b9\7l\2\2\u03b8\u03b7\3\2\2\2\u03b8\u03b9"+
		"\3\2\2\2\u03b9\u03ba\3\2\2\2\u03ba\u03bc\7Y\2\2\u03bb\u03bd\7\32\2\2\u03bc"+
		"\u03bb\3\2\2\2\u03bc\u03bd\3\2\2\2\u03bd\u03be\3\2\2\2\u03be\u03c0\7\t"+
		"\2\2\u03bf\u03c1\5Z.\2\u03c0\u03bf\3\2\2\2\u03c0\u03c1\3\2\2\2\u03c1\u03c2"+
		"\3\2\2\2\u03c2\u03c3\7\n\2\2\u03c3\u03c4\7\13\2\2\u03c4\u03c5\5`\61\2"+
		"\u03c5\u03c6\7\f\2\2\u03c6\u03cf\3\2\2\2\u03c7\u03c9\7l\2\2\u03c8\u03c7"+
		"\3\2\2\2\u03c8\u03c9\3\2\2\2\u03c9\u03ca\3\2\2\2\u03ca\u03cb\5|?\2\u03cb"+
		"\u03cc\7<\2\2\u03cc\u03cd\5~@\2\u03cd\u03cf\3\2\2\2\u03ce\u03b6\3\2\2"+
		"\2\u03ce\u03b8\3\2\2\2\u03ce\u03c8\3\2\2\2\u03cf{\3\2\2\2\u03d0\u03d7"+
		"\5\u008eH\2\u03d1\u03d3\7\t\2\2\u03d2\u03d4\5Z.\2\u03d3\u03d2\3\2\2\2"+
		"\u03d3\u03d4\3\2\2\2\u03d4\u03d5\3\2\2\2\u03d5\u03d7\7\n\2\2\u03d6\u03d0"+
		"\3\2\2\2\u03d6\u03d1\3\2\2\2\u03d7}\3\2\2\2\u03d8\u03d9\7\13\2\2\u03d9"+
		"\u03da\5`\61\2\u03da\u03db\7\f\2\2\u03db\u03de\3\2\2\2\u03dc\u03de\5t"+
		";\2\u03dd\u03d8\3\2\2\2\u03dd\u03dc\3\2\2\2\u03de\177\3\2\2\2\u03df\u03e0"+
		"\t\b\2\2\u03e0\u0081\3\2\2\2\u03e1\u03e9\7=\2\2\u03e2\u03e9\7>\2\2\u03e3"+
		"\u03e9\7\u0083\2\2\u03e4\u03e9\7\u0084\2\2\u03e5\u03e9\7\6\2\2\u03e6\u03e9"+
		"\5\u0084C\2\u03e7\u03e9\5\u0086D\2\u03e8\u03e1\3\2\2\2\u03e8\u03e2\3\2"+
		"\2\2\u03e8\u03e3\3\2\2\2\u03e8\u03e4\3\2\2\2\u03e8\u03e5\3\2\2\2\u03e8"+
		"\u03e6\3\2\2\2\u03e8\u03e7\3\2\2\2\u03e9\u0083\3\2\2\2\u03ea\u03eb\t\t"+
		"\2\2\u03eb\u0085\3\2\2\2\u03ec\u03ed\t\n\2\2\u03ed\u0087\3\2\2\2\u03ee"+
		"\u03ef\6E#\2\u03ef\u03f0\5\u008eH\2\u03f0\u03f1\5l\67\2\u03f1\u0089\3"+
		"\2\2\2\u03f2\u03f3\6F$\2\u03f3\u03f4\5\u008eH\2\u03f4\u03f5\5l\67\2\u03f5"+
		"\u008b\3\2\2\2\u03f6\u03f9\7\u0082\2\2\u03f7\u03f9\5\u0090I\2\u03f8\u03f6"+
		"\3\2\2\2\u03f8\u03f7\3\2\2\2\u03f9\u008d\3\2\2\2\u03fa\u03fb\t\13\2\2"+
		"\u03fb\u008f\3\2\2\2\u03fc\u0400\5\u0092J\2\u03fd\u0400\7=\2\2\u03fe\u0400"+
		"\7>\2\2\u03ff\u03fc\3\2\2\2\u03ff\u03fd\3\2\2\2\u03ff\u03fe\3\2\2\2\u0400"+
		"\u0091\3\2\2\2\u0401\u0402\t\f\2\2\u0402\u0093\3\2\2\2\u0403\u0408\7\r"+
		"\2\2\u0404\u0408\7\2\2\3\u0405\u0408\6K%\2\u0406\u0408\6K&\2\u0407\u0403"+
		"\3\2\2\2\u0407\u0404\3\2\2\2\u0407\u0405\3\2\2\2\u0407\u0406\3\2\2\2\u0408"+
		"\u0095\3\2\2\2\u0409\u040a\5\u0098M\2\u040a\u0097\3\2\2\2\u040b\u0411"+
		"\5\u009cO\2\u040c\u040d\7\t\2\2\u040d\u040e\5\u0098M\2\u040e\u040f\7\n"+
		"\2\2\u040f\u0411\3\2\2\2\u0410\u040b\3\2\2\2\u0410\u040c\3\2\2\2\u0411"+
		"\u0415\3\2\2\2\u0412\u0414\5\u009aN\2\u0413\u0412\3\2\2\2\u0414\u0417"+
		"\3\2\2\2\u0415\u0413\3\2\2\2\u0415\u0416\3\2\2\2\u0416\u0099\3\2\2\2\u0417"+
		"\u0415\3\2\2\2\u0418\u041a\7p\2\2\u0419\u041b\7v\2\2\u041a\u0419\3\2\2"+
		"\2\u041a\u041b\3\2\2\2\u041b\u0421\3\2\2\2\u041c\u0422\5\u009cO\2\u041d"+
		"\u041e\7\t\2\2\u041e\u041f\5\u0098M\2\u041f\u0420\7\n\2\2\u0420\u0422"+
		"\3\2\2\2\u0421\u041c\3\2\2\2\u0421\u041d\3\2\2\2\u0422\u009b\3\2\2\2\u0423"+
		"\u0425\5\u00b4[\2\u0424\u0423\3\2\2\2\u0424\u0425\3\2\2\2\u0425\u0426"+
		"\3\2\2\2\u0426\u0427\7o\2\2\u0427\u0429\5\u009eP\2\u0428\u042a\5\u00b6"+
		"\\\2\u0429\u0428\3\2\2\2\u0429\u042a\3\2\2\2\u042a\u042c\3\2\2\2\u042b"+
		"\u042d\5\u00a2R\2\u042c\u042b\3\2\2\2\u042c\u042d\3\2\2\2\u042d\u042f"+
		"\3\2\2\2\u042e\u0430\5\u00a4S\2\u042f\u042e\3\2\2\2\u042f\u0430\3\2\2"+
		"\2\u0430\u0432\3\2\2\2\u0431\u0433\5\u00b2Z\2\u0432\u0431\3\2\2\2\u0432"+
		"\u0433\3\2\2\2\u0433\u009d\3\2\2\2\u0434\u0439\5\u00a0Q\2\u0435\u0436"+
		"\7\16\2\2\u0436\u0438\5\u00a0Q\2\u0437\u0435\3\2\2\2\u0438\u043b\3\2\2"+
		"\2\u0439\u0437\3\2\2\2\u0439\u043a\3\2\2\2\u043a\u009f\3\2\2\2\u043b\u0439"+
		"\3\2\2\2\u043c\u0449\7\32\2\2\u043d\u0440\5\u008eH\2\u043e\u043f\7b\2"+
		"\2\u043f\u0441\5\u008cG\2\u0440\u043e\3\2\2\2\u0440\u0441\3\2\2\2\u0441"+
		"\u0449\3\2\2\2\u0442\u0443\5t;\2\u0443\u0446\5n8\2\u0444\u0445\7b\2\2"+
		"\u0445\u0447\5\u008cG\2\u0446\u0444\3\2\2\2\u0446\u0447\3\2\2\2\u0447"+
		"\u0449\3\2\2\2\u0448\u043c\3\2\2\2\u0448\u043d\3\2\2\2\u0448\u0442\3\2"+
		"\2\2\u0449\u00a1\3\2\2\2\u044a\u044b\7c\2\2\u044b\u044c\5\u00a6T\2\u044c"+
		"\u00a3\3\2\2\2\u044d\u044e\7q\2\2\u044e\u044f\5r:\2\u044f\u00a5\3\2\2"+
		"\2\u0450\u0455\5\u00a8U\2\u0451\u0452\7\16\2\2\u0452\u0454\5\u00a8U\2"+
		"\u0453\u0451\3\2\2\2\u0454\u0457\3\2\2\2\u0455\u0453\3\2\2\2\u0455\u0456"+
		"\3\2\2\2\u0456\u00a7\3\2\2\2\u0457\u0455\3\2\2\2\u0458\u045e\5\u00aaV"+
		"\2\u0459\u045a\7\t\2\2\u045a\u045b\5\u00aaV\2\u045b\u045c\7\n\2\2\u045c"+
		"\u045e\3\2\2\2\u045d\u0458\3\2\2\2\u045d\u0459\3\2\2\2\u045e\u00a9\3\2"+
		"\2\2\u045f\u0461\5\u00acW\2\u0460\u0462\5\u00b0Y\2\u0461\u0460\3\2\2\2"+
		"\u0461\u0462\3\2\2\2\u0462\u0466\3\2\2\2\u0463\u0465\5\u00aeX\2\u0464"+
		"\u0463\3\2\2\2\u0465\u0468\3\2\2\2\u0466\u0464\3\2\2\2\u0466\u0467\3\2"+
		"\2\2\u0467\u00ab\3\2\2\2\u0468\u0466\3\2\2\2\u0469\u0473\7n\2\2\u046a"+
		"\u046b\5t;\2\u046b\u046c\5n8\2\u046c\u0473\3\2\2\2\u046d\u0473\5\u008e"+
		"H\2\u046e\u046f\7\t\2\2\u046f\u0470\5\u0098M\2\u0470\u0471\7\n\2\2\u0471"+
		"\u0473\3\2\2\2\u0472\u0469\3\2\2\2\u0472\u046a\3\2\2\2\u0472\u046d\3\2"+
		"\2\2\u0472\u046e\3\2\2\2\u0473\u00ad\3\2\2\2\u0474\u0475\7r\2\2\u0475"+
		"\u047e\5\u00a6T\2\u0476\u0477\7r\2\2\u0477\u0478\5\u00a6T\2\u0478\u0479"+
		"\7s\2\2\u0479\u047a\5t;\2\u047a\u047b\t\r\2\2\u047b\u047c\5t;\2\u047c"+
		"\u047e\3\2\2\2\u047d\u0474\3\2\2\2\u047d\u0476\3\2\2\2\u047e\u00af\3\2"+
		"\2\2\u047f\u0480\7u\2\2\u0480\u0484\5\u00b8]\2\u0481\u0482\7u\2\2\u0482"+
		"\u0484\5t;\2\u0483\u047f\3\2\2\2\u0483\u0481\3\2\2\2\u0484\u00b1\3\2\2"+
		"\2\u0485\u0486\7t\2\2\u0486\u0487\5t;\2\u0487\u00b3\3\2\2\2\u0488\u0489"+
		"\7u\2\2\u0489\u048a\5t;\2\u048a\u00b5\3\2\2\2\u048b\u048c\7w\2\2\u048c"+
		"\u0491\5t;\2\u048d\u048e\7\16\2\2\u048e\u0490\5t;\2\u048f\u048d\3\2\2"+
		"\2\u0490\u0493\3\2\2\2\u0491\u048f\3\2\2\2\u0491\u0492\3\2\2\2\u0492\u00b7"+
		"\3\2\2\2\u0493\u0491\3\2\2\2\u0494\u049d\7\13\2\2\u0495\u049a\5\u00ba"+
		"^\2\u0496\u0497\7\16\2\2\u0497\u0499\5\u00ba^\2\u0498\u0496\3\2\2\2\u0499"+
		"\u049c\3\2\2\2\u049a\u0498\3\2\2\2\u049a\u049b\3\2\2\2\u049b\u049e\3\2"+
		"\2\2\u049c\u049a\3\2\2\2\u049d\u0495\3\2\2\2\u049d\u049e\3\2\2\2\u049e"+
		"\u04a0\3\2\2\2\u049f\u04a1\7\16\2\2\u04a0\u049f\3\2\2\2\u04a0\u04a1\3"+
		"\2\2\2\u04a1\u04a2\3\2\2\2\u04a2\u04a3\7\f\2\2\u04a3\u00b9\3\2\2\2\u04a4"+
		"\u04a5\5l\67\2\u04a5\u04a6\7\21\2\2\u04a6\u04a7\5t;\2\u04a7\u00bb\3\2"+
		"\2\2\u008a\u00bd\u00c0\u00da\u00de\u00e5\u00f0\u00f8\u00fc\u0101\u0109"+
		"\u010e\u0110\u0118\u011c\u0124\u0129\u0132\u0136\u013e\u0142\u0147\u0152"+
		"\u0158\u0167\u017b\u017f\u0183\u018b\u0194\u0199\u01a1\u01a8\u01af\u01b6"+
		"\u01c8\u01cc\u01ce\u01d5\u01db\u01e0\u01ef\u01f2\u01f7\u01fa\u0205\u0209"+
		"\u020e\u021a\u0220\u022c\u022e\u0234\u023a\u023d\u0240\u0245\u024d\u0250"+
		"\u025a\u025d\u0262\u0269\u0270\u0275\u0277\u027a\u027f\u0285\u028a\u0293"+
		"\u0297\u029c\u02a1\u02a7\u02ab\u02ba\u02bd\u02c2\u02d9\u02dc\u02e5\u02ed"+
		"\u02f1\u02f3\u02f8\u02fc\u0303\u030a\u031a\u033c\u033f\u034b\u038b\u038f"+
		"\u039c\u039e\u03a4\u03ac\u03af\u03b2\u03b8\u03bc\u03c0\u03c8\u03ce\u03d3"+
		"\u03d6\u03dd\u03e8\u03f8\u03ff\u0407\u0410\u0415\u041a\u0421\u0424\u0429"+
		"\u042c\u042f\u0432\u0439\u0440\u0446\u0448\u0455\u045d\u0461\u0466\u0472"+
		"\u047d\u0483\u0491\u049a\u049d\u04a0";
	public static final ATN _ATN =
		new ATNDeserializer().deserialize(_serializedATN.toCharArray());
	static {
		_decisionToDFA = new DFA[_ATN.getNumberOfDecisions()];
		for (int i = 0; i < _ATN.getNumberOfDecisions(); i++) {
			_decisionToDFA[i] = new DFA(_ATN.getDecisionState(i), i);
		}
	}
}