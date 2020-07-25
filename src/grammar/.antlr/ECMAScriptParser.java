// Generated from /home/greg/dev/delven.io/delven-transpiler/src/grammar/ECMAScriptParser.g4 by ANTLR 4.7.1
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
	static { RuntimeMetaData.checkVersion("4.7.1", RuntimeMetaData.VERSION); }

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
		RULE_classElement = 41, RULE_methodDefinition = 42, RULE_formalParameterList = 43, 
		RULE_formalParameterArg = 44, RULE_lastFormalParameterArg = 45, RULE_functionBody = 46, 
		RULE_sourceElements = 47, RULE_arrayLiteral = 48, RULE_elementList = 49, 
		RULE_arrayElement = 50, RULE_propertyAssignment = 51, RULE_propertyName = 52, 
		RULE_arguments = 53, RULE_argument = 54, RULE_expressionSequence = 55, 
		RULE_singleExpression = 56, RULE_assignable = 57, RULE_objectLiteral = 58, 
		RULE_anoymousFunction = 59, RULE_arrowFunctionParameters = 60, RULE_arrowFunctionBody = 61, 
		RULE_assignmentOperator = 62, RULE_literal = 63, RULE_numericLiteral = 64, 
		RULE_bigintLiteral = 65, RULE_getter = 66, RULE_setter = 67, RULE_identifierName = 68, 
		RULE_identifier = 69, RULE_reservedWord = 70, RULE_keyword = 71, RULE_eos = 72, 
		RULE_querySelectStatement = 73, RULE_queryExpression = 74, RULE_sql_union = 75, 
		RULE_querySpecification = 76, RULE_select_list = 77, RULE_select_list_elem = 78, 
		RULE_fromClause = 79, RULE_whereClause = 80, RULE_dataSources = 81, RULE_dataSource = 82, 
		RULE_data_source_item_joined = 83, RULE_data_source_item = 84, RULE_join_clause = 85, 
		RULE_using_source_clause = 86, RULE_produce_clause = 87, RULE_bind_clause = 88, 
		RULE_withinClause = 89, RULE_queryObjectLiteral = 90, RULE_queryPropertyAssignment = 91;
	public static final String[] ruleNames = {
		"program", "sourceElement", "statement", "block", "statementList", "importStatement", 
		"importFromBlock", "moduleItems", "importDefault", "importNamespace", 
		"importFrom", "aliasName", "exportStatement", "exportFromBlock", "declaration", 
		"variableStatement", "variableDeclarationList", "variableDeclaration", 
		"emptyStatement", "expressionStatement", "ifStatement", "iterationStatement", 
		"varModifier", "continueStatement", "breakStatement", "returnStatement", 
		"withStatement", "switchStatement", "caseBlock", "caseClauses", "caseClause", 
		"defaultClause", "labelledStatement", "throwStatement", "tryStatement", 
		"catchProduction", "finallyProduction", "debuggerStatement", "functionDeclaration", 
		"classDeclaration", "classTail", "classElement", "methodDefinition", "formalParameterList", 
		"formalParameterArg", "lastFormalParameterArg", "functionBody", "sourceElements", 
		"arrayLiteral", "elementList", "arrayElement", "propertyAssignment", "propertyName", 
		"arguments", "argument", "expressionSequence", "singleExpression", "assignable", 
		"objectLiteral", "anoymousFunction", "arrowFunctionParameters", "arrowFunctionBody", 
		"assignmentOperator", "literal", "numericLiteral", "bigintLiteral", "getter", 
		"setter", "identifierName", "identifier", "reservedWord", "keyword", "eos", 
		"querySelectStatement", "queryExpression", "sql_union", "querySpecification", 
		"select_list", "select_list_elem", "fromClause", "whereClause", "dataSources", 
		"dataSource", "data_source_item_joined", "data_source_item", "join_clause", 
		"using_source_clause", "produce_clause", "bind_clause", "withinClause", 
		"queryObjectLiteral", "queryPropertyAssignment"
	};

	private static final String[] _LITERAL_NAMES = {
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
		"'as'", "'from'", null, "'class'", "'enum'", "'extends'", "'super'", "'const'", 
		"'export'", "'import'", "'async'", "'await'", null, "'select'", "'union'", 
		"'where'", "'join'", "'on'", "'produce'", "'using'", "'all'", "'within'", 
		"'implements'", null, null, "'private'", "'public'", "'interface'", "'package'", 
		"'protected'", "'static'", "'yield'"
	};
	private static final String[] _SYMBOLIC_NAMES = {
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
		"Select", "Union", "Where", "Join", "On", "Produce", "Using", "All", "Within", 
		"Implements", "StrictLet", "NonStrictLet", "Private", "Public", "Interface", 
		"Package", "Protected", "Static", "Yield", "Identifier", "StringLiteral", 
		"TemplateStringLiteral", "WhiteSpaces", "LineTerminator", "NEWLINE", "HtmlComment", 
		"CDataComment", "UnexpectedCharacter"
	};
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
			setState(185);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,0,_ctx) ) {
			case 1:
				{
				setState(184);
				match(HashBangLine);
				}
				break;
			}
			setState(188);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,1,_ctx) ) {
			case 1:
				{
				setState(187);
				sourceElements();
				}
				break;
			}
			setState(190);
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
			setState(192);
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
			setState(214);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,2,_ctx) ) {
			case 1:
				enterOuterAlt(_localctx, 1);
				{
				setState(194);
				block();
				}
				break;
			case 2:
				enterOuterAlt(_localctx, 2);
				{
				setState(195);
				querySelectStatement();
				}
				break;
			case 3:
				enterOuterAlt(_localctx, 3);
				{
				setState(196);
				variableStatement();
				}
				break;
			case 4:
				enterOuterAlt(_localctx, 4);
				{
				setState(197);
				importStatement();
				}
				break;
			case 5:
				enterOuterAlt(_localctx, 5);
				{
				setState(198);
				exportStatement();
				}
				break;
			case 6:
				enterOuterAlt(_localctx, 6);
				{
				setState(199);
				emptyStatement();
				}
				break;
			case 7:
				enterOuterAlt(_localctx, 7);
				{
				setState(200);
				classDeclaration();
				}
				break;
			case 8:
				enterOuterAlt(_localctx, 8);
				{
				setState(201);
				functionDeclaration();
				}
				break;
			case 9:
				enterOuterAlt(_localctx, 9);
				{
				setState(202);
				expressionStatement();
				}
				break;
			case 10:
				enterOuterAlt(_localctx, 10);
				{
				setState(203);
				ifStatement();
				}
				break;
			case 11:
				enterOuterAlt(_localctx, 11);
				{
				setState(204);
				iterationStatement();
				}
				break;
			case 12:
				enterOuterAlt(_localctx, 12);
				{
				setState(205);
				continueStatement();
				}
				break;
			case 13:
				enterOuterAlt(_localctx, 13);
				{
				setState(206);
				breakStatement();
				}
				break;
			case 14:
				enterOuterAlt(_localctx, 14);
				{
				setState(207);
				returnStatement();
				}
				break;
			case 15:
				enterOuterAlt(_localctx, 15);
				{
				setState(208);
				withStatement();
				}
				break;
			case 16:
				enterOuterAlt(_localctx, 16);
				{
				setState(209);
				labelledStatement();
				}
				break;
			case 17:
				enterOuterAlt(_localctx, 17);
				{
				setState(210);
				switchStatement();
				}
				break;
			case 18:
				enterOuterAlt(_localctx, 18);
				{
				setState(211);
				throwStatement();
				}
				break;
			case 19:
				enterOuterAlt(_localctx, 19);
				{
				setState(212);
				tryStatement();
				}
				break;
			case 20:
				enterOuterAlt(_localctx, 20);
				{
				setState(213);
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
			setState(216);
			match(OpenBrace);
			setState(218);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,3,_ctx) ) {
			case 1:
				{
				setState(217);
				statementList();
				}
				break;
			}
			setState(220);
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
			setState(223); 
			_errHandler.sync(this);
			_alt = 1;
			do {
				switch (_alt) {
				case 1:
					{
					{
					setState(222);
					statement();
					}
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				setState(225); 
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
			setState(227);
			match(Import);
			setState(228);
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
		public ImportFromContext importFrom() {
			return getRuleContext(ImportFromContext.class,0);
		}
		public EosContext eos() {
			return getRuleContext(EosContext.class,0);
		}
		public ImportNamespaceContext importNamespace() {
			return getRuleContext(ImportNamespaceContext.class,0);
		}
		public ModuleItemsContext moduleItems() {
			return getRuleContext(ModuleItemsContext.class,0);
		}
		public ImportDefaultContext importDefault() {
			return getRuleContext(ImportDefaultContext.class,0);
		}
		public TerminalNode StringLiteral() { return getToken(ECMAScriptParser.StringLiteral, 0); }
		public ImportFromBlockContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_importFromBlock; }
	}

	public final ImportFromBlockContext importFromBlock() throws RecognitionException {
		ImportFromBlockContext _localctx = new ImportFromBlockContext(_ctx, getState());
		enterRule(_localctx, 12, RULE_importFromBlock);
		try {
			setState(242);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case OpenBrace:
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
				setState(231);
				_errHandler.sync(this);
				switch ( getInterpreter().adaptivePredict(_input,5,_ctx) ) {
				case 1:
					{
					setState(230);
					importDefault();
					}
					break;
				}
				setState(235);
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
					setState(233);
					importNamespace();
					}
					break;
				case OpenBrace:
					{
					setState(234);
					moduleItems();
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				setState(237);
				importFrom();
				setState(238);
				eos();
				}
				break;
			case StringLiteral:
				enterOuterAlt(_localctx, 2);
				{
				setState(240);
				match(StringLiteral);
				setState(241);
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

	public static class ModuleItemsContext extends ParserRuleContext {
		public List<AliasNameContext> aliasName() {
			return getRuleContexts(AliasNameContext.class);
		}
		public AliasNameContext aliasName(int i) {
			return getRuleContext(AliasNameContext.class,i);
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
			setState(244);
			match(OpenBrace);
			setState(250);
			_errHandler.sync(this);
			_alt = getInterpreter().adaptivePredict(_input,8,_ctx);
			while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
				if ( _alt==1 ) {
					{
					{
					setState(245);
					aliasName();
					setState(246);
					match(Comma);
					}
					} 
				}
				setState(252);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,8,_ctx);
			}
			setState(257);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==NullLiteral || _la==BooleanLiteral || ((((_la - 70)) & ~0x3f) == 0 && ((1L << (_la - 70)) & ((1L << (Break - 70)) | (1L << (Do - 70)) | (1L << (Instanceof - 70)) | (1L << (Typeof - 70)) | (1L << (Case - 70)) | (1L << (Else - 70)) | (1L << (New - 70)) | (1L << (Var - 70)) | (1L << (Catch - 70)) | (1L << (Finally - 70)) | (1L << (Return - 70)) | (1L << (Void - 70)) | (1L << (Continue - 70)) | (1L << (For - 70)) | (1L << (Switch - 70)) | (1L << (While - 70)) | (1L << (Debugger - 70)) | (1L << (Function - 70)) | (1L << (This - 70)) | (1L << (With - 70)) | (1L << (Default - 70)) | (1L << (If - 70)) | (1L << (Throw - 70)) | (1L << (Delete - 70)) | (1L << (In - 70)) | (1L << (Try - 70)) | (1L << (As - 70)) | (1L << (From - 70)) | (1L << (Let - 70)) | (1L << (Class - 70)) | (1L << (Enum - 70)) | (1L << (Extends - 70)) | (1L << (Super - 70)) | (1L << (Const - 70)) | (1L << (Export - 70)) | (1L << (Import - 70)) | (1L << (Async - 70)) | (1L << (Await - 70)) | (1L << (Implements - 70)) | (1L << (Private - 70)) | (1L << (Public - 70)) | (1L << (Interface - 70)) | (1L << (Package - 70)) | (1L << (Protected - 70)) | (1L << (Static - 70)) | (1L << (Yield - 70)) | (1L << (Identifier - 70)))) != 0)) {
				{
				setState(253);
				aliasName();
				setState(255);
				_errHandler.sync(this);
				_la = _input.LA(1);
				if (_la==Comma) {
					{
					setState(254);
					match(Comma);
					}
				}

				}
			}

			setState(259);
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
			setState(261);
			aliasName();
			setState(262);
			match(Comma);
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
			setState(266);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case Multiply:
				{
				setState(264);
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
				setState(265);
				identifierName();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			setState(270);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==As) {
				{
				setState(268);
				match(As);
				setState(269);
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
			setState(272);
			match(From);
			setState(273);
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
			setState(275);
			identifierName();
			setState(278);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==As) {
				{
				setState(276);
				match(As);
				setState(277);
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
			setState(296);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,16,_ctx) ) {
			case 1:
				_localctx = new ExportDeclarationContext(_localctx);
				enterOuterAlt(_localctx, 1);
				{
				setState(280);
				match(Export);
				setState(283);
				_errHandler.sync(this);
				switch ( getInterpreter().adaptivePredict(_input,14,_ctx) ) {
				case 1:
					{
					setState(281);
					exportFromBlock();
					}
					break;
				case 2:
					{
					setState(282);
					declaration();
					}
					break;
				}
				setState(285);
				eos();
				}
				break;
			case 2:
				_localctx = new ExportDefaultDeclarationContext(_localctx);
				enterOuterAlt(_localctx, 2);
				{
				setState(287);
				match(Export);
				setState(288);
				match(Default);
				setState(292);
				_errHandler.sync(this);
				switch ( getInterpreter().adaptivePredict(_input,15,_ctx) ) {
				case 1:
					{
					setState(289);
					classDeclaration();
					}
					break;
				case 2:
					{
					setState(290);
					functionDeclaration();
					}
					break;
				case 3:
					{
					setState(291);
					singleExpression(0);
					}
					break;
				}
				setState(294);
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
			setState(308);
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
				setState(298);
				importNamespace();
				setState(299);
				importFrom();
				setState(300);
				eos();
				}
				break;
			case OpenBrace:
				enterOuterAlt(_localctx, 2);
				{
				setState(302);
				moduleItems();
				setState(304);
				_errHandler.sync(this);
				switch ( getInterpreter().adaptivePredict(_input,17,_ctx) ) {
				case 1:
					{
					setState(303);
					importFrom();
					}
					break;
				}
				setState(306);
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
			setState(313);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case Var:
			case Let:
			case Const:
				enterOuterAlt(_localctx, 1);
				{
				setState(310);
				variableStatement();
				}
				break;
			case Class:
				enterOuterAlt(_localctx, 2);
				{
				setState(311);
				classDeclaration();
				}
				break;
			case Function:
			case Async:
				enterOuterAlt(_localctx, 3);
				{
				setState(312);
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
			setState(315);
			variableDeclarationList();
			setState(316);
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
			setState(318);
			varModifier();
			setState(319);
			variableDeclaration();
			setState(324);
			_errHandler.sync(this);
			_alt = getInterpreter().adaptivePredict(_input,20,_ctx);
			while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
				if ( _alt==1 ) {
					{
					{
					setState(320);
					match(Comma);
					setState(321);
					variableDeclaration();
					}
					} 
				}
				setState(326);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,20,_ctx);
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
			setState(327);
			assignable();
			setState(330);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,21,_ctx) ) {
			case 1:
				{
				setState(328);
				match(Assign);
				setState(329);
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
			setState(332);
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
			setState(334);
			if (!(this.notOpenBraceAndNotFunction())) throw new FailedPredicateException(this, "this.notOpenBraceAndNotFunction()");
			setState(335);
			expressionSequence();
			setState(336);
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
		public ExpressionSequenceContext expressionSequence() {
			return getRuleContext(ExpressionSequenceContext.class,0);
		}
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
			setState(338);
			match(If);
			setState(339);
			match(OpenParen);
			setState(340);
			expressionSequence();
			setState(341);
			match(CloseParen);
			setState(342);
			statement();
			setState(345);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,22,_ctx) ) {
			case 1:
				{
				setState(343);
				match(Else);
				setState(344);
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
		public ExpressionSequenceContext expressionSequence() {
			return getRuleContext(ExpressionSequenceContext.class,0);
		}
		public EosContext eos() {
			return getRuleContext(EosContext.class,0);
		}
		public DoStatementContext(IterationStatementContext ctx) { copyFrom(ctx); }
	}
	public static class WhileStatementContext extends IterationStatementContext {
		public TerminalNode While() { return getToken(ECMAScriptParser.While, 0); }
		public ExpressionSequenceContext expressionSequence() {
			return getRuleContext(ExpressionSequenceContext.class,0);
		}
		public StatementContext statement() {
			return getRuleContext(StatementContext.class,0);
		}
		public WhileStatementContext(IterationStatementContext ctx) { copyFrom(ctx); }
	}
	public static class ForStatementContext extends IterationStatementContext {
		public TerminalNode For() { return getToken(ECMAScriptParser.For, 0); }
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
		public TerminalNode In() { return getToken(ECMAScriptParser.In, 0); }
		public ExpressionSequenceContext expressionSequence() {
			return getRuleContext(ExpressionSequenceContext.class,0);
		}
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
		public IdentifierContext identifier() {
			return getRuleContext(IdentifierContext.class,0);
		}
		public ExpressionSequenceContext expressionSequence() {
			return getRuleContext(ExpressionSequenceContext.class,0);
		}
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
			setState(403);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,29,_ctx) ) {
			case 1:
				_localctx = new DoStatementContext(_localctx);
				enterOuterAlt(_localctx, 1);
				{
				setState(347);
				match(Do);
				setState(348);
				statement();
				setState(349);
				match(While);
				setState(350);
				match(OpenParen);
				setState(351);
				expressionSequence();
				setState(352);
				match(CloseParen);
				setState(353);
				eos();
				}
				break;
			case 2:
				_localctx = new WhileStatementContext(_localctx);
				enterOuterAlt(_localctx, 2);
				{
				setState(355);
				match(While);
				setState(356);
				match(OpenParen);
				setState(357);
				expressionSequence();
				setState(358);
				match(CloseParen);
				setState(359);
				statement();
				}
				break;
			case 3:
				_localctx = new ForStatementContext(_localctx);
				enterOuterAlt(_localctx, 3);
				{
				setState(361);
				match(For);
				setState(362);
				match(OpenParen);
				setState(365);
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
					setState(363);
					expressionSequence();
					}
					break;
				case Var:
				case Let:
				case Const:
					{
					setState(364);
					variableDeclarationList();
					}
					break;
				case SemiColon:
					break;
				default:
					break;
				}
				setState(367);
				match(SemiColon);
				setState(369);
				_errHandler.sync(this);
				_la = _input.LA(1);
				if (((((_la - 4)) & ~0x3f) == 0 && ((1L << (_la - 4)) & ((1L << (RegularExpressionLiteral - 4)) | (1L << (OpenBracket - 4)) | (1L << (OpenParen - 4)) | (1L << (OpenBrace - 4)) | (1L << (PlusPlus - 4)) | (1L << (MinusMinus - 4)) | (1L << (Plus - 4)) | (1L << (Minus - 4)) | (1L << (BitNot - 4)) | (1L << (Not - 4)) | (1L << (NullLiteral - 4)) | (1L << (BooleanLiteral - 4)) | (1L << (DecimalLiteral - 4)) | (1L << (HexIntegerLiteral - 4)) | (1L << (OctalIntegerLiteral - 4)) | (1L << (OctalIntegerLiteral2 - 4)) | (1L << (BinaryIntegerLiteral - 4)) | (1L << (BigHexIntegerLiteral - 4)) | (1L << (BigOctalIntegerLiteral - 4)))) != 0) || ((((_la - 68)) & ~0x3f) == 0 && ((1L << (_la - 68)) & ((1L << (BigBinaryIntegerLiteral - 68)) | (1L << (BigDecimalIntegerLiteral - 68)) | (1L << (Typeof - 68)) | (1L << (New - 68)) | (1L << (Void - 68)) | (1L << (Function - 68)) | (1L << (This - 68)) | (1L << (Delete - 68)) | (1L << (Class - 68)) | (1L << (Super - 68)) | (1L << (Import - 68)) | (1L << (Async - 68)) | (1L << (Await - 68)) | (1L << (Select - 68)) | (1L << (Using - 68)) | (1L << (NonStrictLet - 68)) | (1L << (Yield - 68)) | (1L << (Identifier - 68)) | (1L << (StringLiteral - 68)) | (1L << (TemplateStringLiteral - 68)))) != 0)) {
					{
					setState(368);
					expressionSequence();
					}
				}

				setState(371);
				match(SemiColon);
				setState(373);
				_errHandler.sync(this);
				_la = _input.LA(1);
				if (((((_la - 4)) & ~0x3f) == 0 && ((1L << (_la - 4)) & ((1L << (RegularExpressionLiteral - 4)) | (1L << (OpenBracket - 4)) | (1L << (OpenParen - 4)) | (1L << (OpenBrace - 4)) | (1L << (PlusPlus - 4)) | (1L << (MinusMinus - 4)) | (1L << (Plus - 4)) | (1L << (Minus - 4)) | (1L << (BitNot - 4)) | (1L << (Not - 4)) | (1L << (NullLiteral - 4)) | (1L << (BooleanLiteral - 4)) | (1L << (DecimalLiteral - 4)) | (1L << (HexIntegerLiteral - 4)) | (1L << (OctalIntegerLiteral - 4)) | (1L << (OctalIntegerLiteral2 - 4)) | (1L << (BinaryIntegerLiteral - 4)) | (1L << (BigHexIntegerLiteral - 4)) | (1L << (BigOctalIntegerLiteral - 4)))) != 0) || ((((_la - 68)) & ~0x3f) == 0 && ((1L << (_la - 68)) & ((1L << (BigBinaryIntegerLiteral - 68)) | (1L << (BigDecimalIntegerLiteral - 68)) | (1L << (Typeof - 68)) | (1L << (New - 68)) | (1L << (Void - 68)) | (1L << (Function - 68)) | (1L << (This - 68)) | (1L << (Delete - 68)) | (1L << (Class - 68)) | (1L << (Super - 68)) | (1L << (Import - 68)) | (1L << (Async - 68)) | (1L << (Await - 68)) | (1L << (Select - 68)) | (1L << (Using - 68)) | (1L << (NonStrictLet - 68)) | (1L << (Yield - 68)) | (1L << (Identifier - 68)) | (1L << (StringLiteral - 68)) | (1L << (TemplateStringLiteral - 68)))) != 0)) {
					{
					setState(372);
					expressionSequence();
					}
				}

				setState(375);
				match(CloseParen);
				setState(376);
				statement();
				}
				break;
			case 4:
				_localctx = new ForInStatementContext(_localctx);
				enterOuterAlt(_localctx, 4);
				{
				setState(377);
				match(For);
				setState(378);
				match(OpenParen);
				setState(381);
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
					setState(379);
					singleExpression(0);
					}
					break;
				case Var:
				case Let:
				case Const:
					{
					setState(380);
					variableDeclarationList();
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				setState(383);
				match(In);
				setState(384);
				expressionSequence();
				setState(385);
				match(CloseParen);
				setState(386);
				statement();
				}
				break;
			case 5:
				_localctx = new ForOfStatementContext(_localctx);
				enterOuterAlt(_localctx, 5);
				{
				setState(388);
				match(For);
				setState(390);
				_errHandler.sync(this);
				_la = _input.LA(1);
				if (_la==Await) {
					{
					setState(389);
					match(Await);
					}
				}

				setState(392);
				match(OpenParen);
				setState(395);
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
					setState(393);
					singleExpression(0);
					}
					break;
				case Var:
				case Let:
				case Const:
					{
					setState(394);
					variableDeclarationList();
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				setState(397);
				identifier();
				setState(398);
				if (!(this.p("of"))) throw new FailedPredicateException(this, "this.p(\"of\")");
				setState(399);
				expressionSequence();
				setState(400);
				match(CloseParen);
				setState(401);
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
			setState(405);
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
			setState(407);
			match(Continue);
			setState(410);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,30,_ctx) ) {
			case 1:
				{
				setState(408);
				if (!(this.notLineTerminator())) throw new FailedPredicateException(this, "this.notLineTerminator()");
				setState(409);
				identifier();
				}
				break;
			}
			setState(412);
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
			setState(414);
			match(Break);
			setState(417);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,31,_ctx) ) {
			case 1:
				{
				setState(415);
				if (!(this.notLineTerminator())) throw new FailedPredicateException(this, "this.notLineTerminator()");
				setState(416);
				identifier();
				}
				break;
			}
			setState(419);
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
			setState(421);
			match(Return);
			setState(424);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,32,_ctx) ) {
			case 1:
				{
				setState(422);
				if (!(this.notLineTerminator())) throw new FailedPredicateException(this, "this.notLineTerminator()");
				setState(423);
				expressionSequence();
				}
				break;
			}
			setState(426);
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
		public ExpressionSequenceContext expressionSequence() {
			return getRuleContext(ExpressionSequenceContext.class,0);
		}
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
			setState(428);
			match(With);
			setState(429);
			match(OpenParen);
			setState(430);
			expressionSequence();
			setState(431);
			match(CloseParen);
			setState(432);
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
		public ExpressionSequenceContext expressionSequence() {
			return getRuleContext(ExpressionSequenceContext.class,0);
		}
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
			setState(434);
			match(Switch);
			setState(435);
			match(OpenParen);
			setState(436);
			expressionSequence();
			setState(437);
			match(CloseParen);
			setState(438);
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
			setState(440);
			match(OpenBrace);
			setState(442);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==Case) {
				{
				setState(441);
				caseClauses();
				}
			}

			setState(448);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==Default) {
				{
				setState(444);
				defaultClause();
				setState(446);
				_errHandler.sync(this);
				_la = _input.LA(1);
				if (_la==Case) {
					{
					setState(445);
					caseClauses();
					}
				}

				}
			}

			setState(450);
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
			setState(453); 
			_errHandler.sync(this);
			_la = _input.LA(1);
			do {
				{
				{
				setState(452);
				caseClause();
				}
				}
				setState(455); 
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
			setState(457);
			match(Case);
			setState(458);
			expressionSequence();
			setState(459);
			match(Colon);
			setState(461);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,37,_ctx) ) {
			case 1:
				{
				setState(460);
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
			setState(463);
			match(Default);
			setState(464);
			match(Colon);
			setState(466);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,38,_ctx) ) {
			case 1:
				{
				setState(465);
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
			setState(468);
			identifier();
			setState(469);
			match(Colon);
			setState(470);
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
			setState(472);
			match(Throw);
			setState(473);
			if (!(this.notLineTerminator())) throw new FailedPredicateException(this, "this.notLineTerminator()");
			setState(474);
			expressionSequence();
			setState(475);
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
			setState(477);
			match(Try);
			setState(478);
			block();
			setState(484);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case Catch:
				{
				setState(479);
				catchProduction();
				setState(481);
				_errHandler.sync(this);
				switch ( getInterpreter().adaptivePredict(_input,39,_ctx) ) {
				case 1:
					{
					setState(480);
					finallyProduction();
					}
					break;
				}
				}
				break;
			case Finally:
				{
				setState(483);
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
			setState(486);
			match(Catch);
			setState(492);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==OpenParen) {
				{
				setState(487);
				match(OpenParen);
				setState(489);
				_errHandler.sync(this);
				_la = _input.LA(1);
				if (_la==OpenBracket || _la==OpenBrace || ((((_la - 106)) & ~0x3f) == 0 && ((1L << (_la - 106)) & ((1L << (Async - 106)) | (1L << (NonStrictLet - 106)) | (1L << (Identifier - 106)))) != 0)) {
					{
					setState(488);
					assignable();
					}
				}

				setState(491);
				match(CloseParen);
				}
			}

			setState(494);
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
			setState(496);
			match(Finally);
			setState(497);
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
			setState(499);
			match(Debugger);
			setState(500);
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
		public FunctionBodyContext functionBody() {
			return getRuleContext(FunctionBodyContext.class,0);
		}
		public TerminalNode Async() { return getToken(ECMAScriptParser.Async, 0); }
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
			setState(503);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==Async) {
				{
				setState(502);
				match(Async);
				}
			}

			setState(505);
			match(Function);
			setState(507);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==Multiply) {
				{
				setState(506);
				match(Multiply);
				}
			}

			setState(509);
			identifier();
			setState(510);
			match(OpenParen);
			setState(512);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if ((((_la) & ~0x3f) == 0 && ((1L << _la) & ((1L << OpenBracket) | (1L << OpenBrace) | (1L << Ellipsis))) != 0) || ((((_la - 106)) & ~0x3f) == 0 && ((1L << (_la - 106)) & ((1L << (Async - 106)) | (1L << (NonStrictLet - 106)) | (1L << (Identifier - 106)))) != 0)) {
				{
				setState(511);
				formalParameterList();
				}
			}

			setState(514);
			match(CloseParen);
			setState(515);
			match(OpenBrace);
			setState(516);
			functionBody();
			setState(517);
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
			setState(519);
			match(Class);
			setState(520);
			identifier();
			setState(521);
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
		public TerminalNode Extends() { return getToken(ECMAScriptParser.Extends, 0); }
		public SingleExpressionContext singleExpression() {
			return getRuleContext(SingleExpressionContext.class,0);
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
			setState(525);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==Extends) {
				{
				setState(523);
				match(Extends);
				setState(524);
				singleExpression(0);
				}
			}

			setState(527);
			match(OpenBrace);
			setState(531);
			_errHandler.sync(this);
			_alt = getInterpreter().adaptivePredict(_input,47,_ctx);
			while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
				if ( _alt==1 ) {
					{
					{
					setState(528);
					classElement();
					}
					} 
				}
				setState(533);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,47,_ctx);
			}
			setState(534);
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

	public static class ClassElementContext extends ParserRuleContext {
		public MethodDefinitionContext methodDefinition() {
			return getRuleContext(MethodDefinitionContext.class,0);
		}
		public AssignableContext assignable() {
			return getRuleContext(AssignableContext.class,0);
		}
		public ObjectLiteralContext objectLiteral() {
			return getRuleContext(ObjectLiteralContext.class,0);
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
		public SingleExpressionContext singleExpression() {
			return getRuleContext(SingleExpressionContext.class,0);
		}
		public ClassElementContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_classElement; }
	}

	public final ClassElementContext classElement() throws RecognitionException {
		ClassElementContext _localctx = new ClassElementContext(_ctx, getState());
		enterRule(_localctx, 82, RULE_classElement);
		int _la;
		try {
			int _alt;
			setState(561);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,52,_ctx) ) {
			case 1:
				enterOuterAlt(_localctx, 1);
				{
				setState(542);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,49,_ctx);
				while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
					if ( _alt==1 ) {
						{
						setState(540);
						_errHandler.sync(this);
						switch ( getInterpreter().adaptivePredict(_input,48,_ctx) ) {
						case 1:
							{
							setState(536);
							match(Static);
							}
							break;
						case 2:
							{
							setState(537);
							if (!(this.n("static"))) throw new FailedPredicateException(this, "this.n(\"static\")");
							setState(538);
							identifier();
							}
							break;
						case 3:
							{
							setState(539);
							match(Async);
							}
							break;
						}
						} 
					}
					setState(544);
					_errHandler.sync(this);
					_alt = getInterpreter().adaptivePredict(_input,49,_ctx);
				}
				setState(551);
				_errHandler.sync(this);
				switch ( getInterpreter().adaptivePredict(_input,50,_ctx) ) {
				case 1:
					{
					setState(545);
					methodDefinition();
					}
					break;
				case 2:
					{
					setState(546);
					assignable();
					setState(547);
					match(Assign);
					setState(548);
					objectLiteral();
					setState(549);
					match(SemiColon);
					}
					break;
				}
				}
				break;
			case 2:
				enterOuterAlt(_localctx, 2);
				{
				setState(553);
				emptyStatement();
				}
				break;
			case 3:
				enterOuterAlt(_localctx, 3);
				{
				setState(555);
				_errHandler.sync(this);
				_la = _input.LA(1);
				if (_la==Hashtag) {
					{
					setState(554);
					match(Hashtag);
					}
				}

				setState(557);
				propertyName();
				setState(558);
				match(Assign);
				setState(559);
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
		public FunctionBodyContext functionBody() {
			return getRuleContext(FunctionBodyContext.class,0);
		}
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
		enterRule(_localctx, 84, RULE_methodDefinition);
		int _la;
		try {
			setState(608);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,61,_ctx) ) {
			case 1:
				enterOuterAlt(_localctx, 1);
				{
				setState(564);
				_errHandler.sync(this);
				_la = _input.LA(1);
				if (_la==Multiply) {
					{
					setState(563);
					match(Multiply);
					}
				}

				setState(567);
				_errHandler.sync(this);
				_la = _input.LA(1);
				if (_la==Hashtag) {
					{
					setState(566);
					match(Hashtag);
					}
				}

				setState(569);
				propertyName();
				setState(570);
				match(OpenParen);
				setState(572);
				_errHandler.sync(this);
				_la = _input.LA(1);
				if ((((_la) & ~0x3f) == 0 && ((1L << _la) & ((1L << OpenBracket) | (1L << OpenBrace) | (1L << Ellipsis))) != 0) || ((((_la - 106)) & ~0x3f) == 0 && ((1L << (_la - 106)) & ((1L << (Async - 106)) | (1L << (NonStrictLet - 106)) | (1L << (Identifier - 106)))) != 0)) {
					{
					setState(571);
					formalParameterList();
					}
				}

				setState(574);
				match(CloseParen);
				setState(575);
				match(OpenBrace);
				setState(576);
				functionBody();
				setState(577);
				match(CloseBrace);
				}
				break;
			case 2:
				enterOuterAlt(_localctx, 2);
				{
				setState(580);
				_errHandler.sync(this);
				switch ( getInterpreter().adaptivePredict(_input,56,_ctx) ) {
				case 1:
					{
					setState(579);
					match(Multiply);
					}
					break;
				}
				setState(583);
				_errHandler.sync(this);
				switch ( getInterpreter().adaptivePredict(_input,57,_ctx) ) {
				case 1:
					{
					setState(582);
					match(Hashtag);
					}
					break;
				}
				setState(585);
				getter();
				setState(586);
				match(OpenParen);
				setState(587);
				match(CloseParen);
				setState(588);
				match(OpenBrace);
				setState(589);
				functionBody();
				setState(590);
				match(CloseBrace);
				}
				break;
			case 3:
				enterOuterAlt(_localctx, 3);
				{
				setState(593);
				_errHandler.sync(this);
				switch ( getInterpreter().adaptivePredict(_input,58,_ctx) ) {
				case 1:
					{
					setState(592);
					match(Multiply);
					}
					break;
				}
				setState(596);
				_errHandler.sync(this);
				switch ( getInterpreter().adaptivePredict(_input,59,_ctx) ) {
				case 1:
					{
					setState(595);
					match(Hashtag);
					}
					break;
				}
				setState(598);
				setter();
				setState(599);
				match(OpenParen);
				setState(601);
				_errHandler.sync(this);
				_la = _input.LA(1);
				if ((((_la) & ~0x3f) == 0 && ((1L << _la) & ((1L << OpenBracket) | (1L << OpenBrace) | (1L << Ellipsis))) != 0) || ((((_la - 106)) & ~0x3f) == 0 && ((1L << (_la - 106)) & ((1L << (Async - 106)) | (1L << (NonStrictLet - 106)) | (1L << (Identifier - 106)))) != 0)) {
					{
					setState(600);
					formalParameterList();
					}
				}

				setState(603);
				match(CloseParen);
				setState(604);
				match(OpenBrace);
				setState(605);
				functionBody();
				setState(606);
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
		enterRule(_localctx, 86, RULE_formalParameterList);
		int _la;
		try {
			int _alt;
			setState(623);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case OpenBracket:
			case OpenBrace:
			case Async:
			case NonStrictLet:
			case Identifier:
				enterOuterAlt(_localctx, 1);
				{
				setState(610);
				formalParameterArg();
				setState(615);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,62,_ctx);
				while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
					if ( _alt==1 ) {
						{
						{
						setState(611);
						match(Comma);
						setState(612);
						formalParameterArg();
						}
						} 
					}
					setState(617);
					_errHandler.sync(this);
					_alt = getInterpreter().adaptivePredict(_input,62,_ctx);
				}
				setState(620);
				_errHandler.sync(this);
				_la = _input.LA(1);
				if (_la==Comma) {
					{
					setState(618);
					match(Comma);
					setState(619);
					lastFormalParameterArg();
					}
				}

				}
				break;
			case Ellipsis:
				enterOuterAlt(_localctx, 2);
				{
				setState(622);
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
		enterRule(_localctx, 88, RULE_formalParameterArg);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(625);
			assignable();
			setState(628);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==Assign) {
				{
				setState(626);
				match(Assign);
				setState(627);
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
		enterRule(_localctx, 90, RULE_lastFormalParameterArg);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(630);
			match(Ellipsis);
			setState(631);
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
		enterRule(_localctx, 92, RULE_functionBody);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(634);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,66,_ctx) ) {
			case 1:
				{
				setState(633);
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
		enterRule(_localctx, 94, RULE_sourceElements);
		try {
			int _alt;
			enterOuterAlt(_localctx, 1);
			{
			setState(637); 
			_errHandler.sync(this);
			_alt = 1;
			do {
				switch (_alt) {
				case 1:
					{
					{
					setState(636);
					sourceElement();
					}
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				setState(639); 
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,67,_ctx);
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
		public ElementListContext elementList() {
			return getRuleContext(ElementListContext.class,0);
		}
		public ArrayLiteralContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_arrayLiteral; }
	}

	public final ArrayLiteralContext arrayLiteral() throws RecognitionException {
		ArrayLiteralContext _localctx = new ArrayLiteralContext(_ctx, getState());
		enterRule(_localctx, 96, RULE_arrayLiteral);
		try {
			enterOuterAlt(_localctx, 1);
			{
			{
			setState(641);
			match(OpenBracket);
			setState(642);
			elementList();
			setState(643);
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
		enterRule(_localctx, 98, RULE_elementList);
		int _la;
		try {
			int _alt;
			enterOuterAlt(_localctx, 1);
			{
			setState(648);
			_errHandler.sync(this);
			_alt = getInterpreter().adaptivePredict(_input,68,_ctx);
			while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
				if ( _alt==1 ) {
					{
					{
					setState(645);
					match(Comma);
					}
					} 
				}
				setState(650);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,68,_ctx);
			}
			setState(652);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (((((_la - 4)) & ~0x3f) == 0 && ((1L << (_la - 4)) & ((1L << (RegularExpressionLiteral - 4)) | (1L << (OpenBracket - 4)) | (1L << (OpenParen - 4)) | (1L << (OpenBrace - 4)) | (1L << (Ellipsis - 4)) | (1L << (PlusPlus - 4)) | (1L << (MinusMinus - 4)) | (1L << (Plus - 4)) | (1L << (Minus - 4)) | (1L << (BitNot - 4)) | (1L << (Not - 4)) | (1L << (NullLiteral - 4)) | (1L << (BooleanLiteral - 4)) | (1L << (DecimalLiteral - 4)) | (1L << (HexIntegerLiteral - 4)) | (1L << (OctalIntegerLiteral - 4)) | (1L << (OctalIntegerLiteral2 - 4)) | (1L << (BinaryIntegerLiteral - 4)) | (1L << (BigHexIntegerLiteral - 4)) | (1L << (BigOctalIntegerLiteral - 4)))) != 0) || ((((_la - 68)) & ~0x3f) == 0 && ((1L << (_la - 68)) & ((1L << (BigBinaryIntegerLiteral - 68)) | (1L << (BigDecimalIntegerLiteral - 68)) | (1L << (Typeof - 68)) | (1L << (New - 68)) | (1L << (Void - 68)) | (1L << (Function - 68)) | (1L << (This - 68)) | (1L << (Delete - 68)) | (1L << (Class - 68)) | (1L << (Super - 68)) | (1L << (Import - 68)) | (1L << (Async - 68)) | (1L << (Await - 68)) | (1L << (Select - 68)) | (1L << (Using - 68)) | (1L << (NonStrictLet - 68)) | (1L << (Yield - 68)) | (1L << (Identifier - 68)) | (1L << (StringLiteral - 68)) | (1L << (TemplateStringLiteral - 68)))) != 0)) {
				{
				setState(651);
				arrayElement();
				}
			}

			setState(662);
			_errHandler.sync(this);
			_alt = getInterpreter().adaptivePredict(_input,71,_ctx);
			while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
				if ( _alt==1 ) {
					{
					{
					setState(655); 
					_errHandler.sync(this);
					_la = _input.LA(1);
					do {
						{
						{
						setState(654);
						match(Comma);
						}
						}
						setState(657); 
						_errHandler.sync(this);
						_la = _input.LA(1);
					} while ( _la==Comma );
					setState(659);
					arrayElement();
					}
					} 
				}
				setState(664);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,71,_ctx);
			}
			setState(668);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==Comma) {
				{
				{
				setState(665);
				match(Comma);
				}
				}
				setState(670);
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
		enterRule(_localctx, 100, RULE_arrayElement);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(672);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==Ellipsis) {
				{
				setState(671);
				match(Ellipsis);
				}
			}

			setState(674);
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
		public SingleExpressionContext singleExpression() {
			return getRuleContext(SingleExpressionContext.class,0);
		}
		public PropertyExpressionAssignmentContext(PropertyAssignmentContext ctx) { copyFrom(ctx); }
	}
	public static class ComputedPropertyExpressionAssignmentContext extends PropertyAssignmentContext {
		public List<SingleExpressionContext> singleExpression() {
			return getRuleContexts(SingleExpressionContext.class);
		}
		public SingleExpressionContext singleExpression(int i) {
			return getRuleContext(SingleExpressionContext.class,i);
		}
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
		public FormalParameterArgContext formalParameterArg() {
			return getRuleContext(FormalParameterArgContext.class,0);
		}
		public FunctionBodyContext functionBody() {
			return getRuleContext(FunctionBodyContext.class,0);
		}
		public PropertySetterContext(PropertyAssignmentContext ctx) { copyFrom(ctx); }
	}
	public static class PropertyGetterContext extends PropertyAssignmentContext {
		public GetterContext getter() {
			return getRuleContext(GetterContext.class,0);
		}
		public FunctionBodyContext functionBody() {
			return getRuleContext(FunctionBodyContext.class,0);
		}
		public PropertyGetterContext(PropertyAssignmentContext ctx) { copyFrom(ctx); }
	}
	public static class FunctionPropertyContext extends PropertyAssignmentContext {
		public PropertyNameContext propertyName() {
			return getRuleContext(PropertyNameContext.class,0);
		}
		public FunctionBodyContext functionBody() {
			return getRuleContext(FunctionBodyContext.class,0);
		}
		public TerminalNode Async() { return getToken(ECMAScriptParser.Async, 0); }
		public FormalParameterListContext formalParameterList() {
			return getRuleContext(FormalParameterListContext.class,0);
		}
		public FunctionPropertyContext(PropertyAssignmentContext ctx) { copyFrom(ctx); }
	}

	public final PropertyAssignmentContext propertyAssignment() throws RecognitionException {
		PropertyAssignmentContext _localctx = new PropertyAssignmentContext(_ctx, getState());
		enterRule(_localctx, 102, RULE_propertyAssignment);
		int _la;
		try {
			setState(721);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,78,_ctx) ) {
			case 1:
				_localctx = new PropertyExpressionAssignmentContext(_localctx);
				enterOuterAlt(_localctx, 1);
				{
				setState(676);
				propertyName();
				setState(677);
				match(Colon);
				setState(678);
				singleExpression(0);
				}
				break;
			case 2:
				_localctx = new ComputedPropertyExpressionAssignmentContext(_localctx);
				enterOuterAlt(_localctx, 2);
				{
				setState(680);
				match(OpenBracket);
				setState(681);
				singleExpression(0);
				setState(682);
				match(CloseBracket);
				setState(683);
				match(Colon);
				setState(684);
				singleExpression(0);
				}
				break;
			case 3:
				_localctx = new FunctionPropertyContext(_localctx);
				enterOuterAlt(_localctx, 3);
				{
				setState(687);
				_errHandler.sync(this);
				switch ( getInterpreter().adaptivePredict(_input,74,_ctx) ) {
				case 1:
					{
					setState(686);
					match(Async);
					}
					break;
				}
				setState(690);
				_errHandler.sync(this);
				_la = _input.LA(1);
				if (_la==Multiply) {
					{
					setState(689);
					match(Multiply);
					}
				}

				setState(692);
				propertyName();
				setState(693);
				match(OpenParen);
				setState(695);
				_errHandler.sync(this);
				_la = _input.LA(1);
				if ((((_la) & ~0x3f) == 0 && ((1L << _la) & ((1L << OpenBracket) | (1L << OpenBrace) | (1L << Ellipsis))) != 0) || ((((_la - 106)) & ~0x3f) == 0 && ((1L << (_la - 106)) & ((1L << (Async - 106)) | (1L << (NonStrictLet - 106)) | (1L << (Identifier - 106)))) != 0)) {
					{
					setState(694);
					formalParameterList();
					}
				}

				setState(697);
				match(CloseParen);
				setState(698);
				match(OpenBrace);
				setState(699);
				functionBody();
				setState(700);
				match(CloseBrace);
				}
				break;
			case 4:
				_localctx = new PropertyGetterContext(_localctx);
				enterOuterAlt(_localctx, 4);
				{
				setState(702);
				getter();
				setState(703);
				match(OpenParen);
				setState(704);
				match(CloseParen);
				setState(705);
				match(OpenBrace);
				setState(706);
				functionBody();
				setState(707);
				match(CloseBrace);
				}
				break;
			case 5:
				_localctx = new PropertySetterContext(_localctx);
				enterOuterAlt(_localctx, 5);
				{
				setState(709);
				setter();
				setState(710);
				match(OpenParen);
				setState(711);
				formalParameterArg();
				setState(712);
				match(CloseParen);
				setState(713);
				match(OpenBrace);
				setState(714);
				functionBody();
				setState(715);
				match(CloseBrace);
				}
				break;
			case 6:
				_localctx = new PropertyShorthandContext(_localctx);
				enterOuterAlt(_localctx, 6);
				{
				setState(718);
				_errHandler.sync(this);
				_la = _input.LA(1);
				if (_la==Ellipsis) {
					{
					setState(717);
					match(Ellipsis);
					}
				}

				setState(720);
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
		public SingleExpressionContext singleExpression() {
			return getRuleContext(SingleExpressionContext.class,0);
		}
		public PropertyNameContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_propertyName; }
	}

	public final PropertyNameContext propertyName() throws RecognitionException {
		PropertyNameContext _localctx = new PropertyNameContext(_ctx, getState());
		enterRule(_localctx, 104, RULE_propertyName);
		try {
			setState(730);
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
				setState(723);
				identifierName();
				}
				break;
			case StringLiteral:
				enterOuterAlt(_localctx, 2);
				{
				setState(724);
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
				setState(725);
				numericLiteral();
				}
				break;
			case OpenBracket:
				enterOuterAlt(_localctx, 4);
				{
				setState(726);
				match(OpenBracket);
				setState(727);
				singleExpression(0);
				setState(728);
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
		public List<ArgumentContext> argument() {
			return getRuleContexts(ArgumentContext.class);
		}
		public ArgumentContext argument(int i) {
			return getRuleContext(ArgumentContext.class,i);
		}
		public ArgumentsContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_arguments; }
	}

	public final ArgumentsContext arguments() throws RecognitionException {
		ArgumentsContext _localctx = new ArgumentsContext(_ctx, getState());
		enterRule(_localctx, 106, RULE_arguments);
		int _la;
		try {
			int _alt;
			enterOuterAlt(_localctx, 1);
			{
			setState(732);
			match(OpenParen);
			setState(744);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (((((_la - 4)) & ~0x3f) == 0 && ((1L << (_la - 4)) & ((1L << (RegularExpressionLiteral - 4)) | (1L << (OpenBracket - 4)) | (1L << (OpenParen - 4)) | (1L << (OpenBrace - 4)) | (1L << (Ellipsis - 4)) | (1L << (PlusPlus - 4)) | (1L << (MinusMinus - 4)) | (1L << (Plus - 4)) | (1L << (Minus - 4)) | (1L << (BitNot - 4)) | (1L << (Not - 4)) | (1L << (NullLiteral - 4)) | (1L << (BooleanLiteral - 4)) | (1L << (DecimalLiteral - 4)) | (1L << (HexIntegerLiteral - 4)) | (1L << (OctalIntegerLiteral - 4)) | (1L << (OctalIntegerLiteral2 - 4)) | (1L << (BinaryIntegerLiteral - 4)) | (1L << (BigHexIntegerLiteral - 4)) | (1L << (BigOctalIntegerLiteral - 4)))) != 0) || ((((_la - 68)) & ~0x3f) == 0 && ((1L << (_la - 68)) & ((1L << (BigBinaryIntegerLiteral - 68)) | (1L << (BigDecimalIntegerLiteral - 68)) | (1L << (Typeof - 68)) | (1L << (New - 68)) | (1L << (Void - 68)) | (1L << (Function - 68)) | (1L << (This - 68)) | (1L << (Delete - 68)) | (1L << (Class - 68)) | (1L << (Super - 68)) | (1L << (Import - 68)) | (1L << (Async - 68)) | (1L << (Await - 68)) | (1L << (Select - 68)) | (1L << (Using - 68)) | (1L << (NonStrictLet - 68)) | (1L << (Yield - 68)) | (1L << (Identifier - 68)) | (1L << (StringLiteral - 68)) | (1L << (TemplateStringLiteral - 68)))) != 0)) {
				{
				setState(733);
				argument();
				setState(738);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,80,_ctx);
				while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
					if ( _alt==1 ) {
						{
						{
						setState(734);
						match(Comma);
						setState(735);
						argument();
						}
						} 
					}
					setState(740);
					_errHandler.sync(this);
					_alt = getInterpreter().adaptivePredict(_input,80,_ctx);
				}
				setState(742);
				_errHandler.sync(this);
				_la = _input.LA(1);
				if (_la==Comma) {
					{
					setState(741);
					match(Comma);
					}
				}

				}
			}

			setState(746);
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
		enterRule(_localctx, 108, RULE_argument);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(749);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==Ellipsis) {
				{
				setState(748);
				match(Ellipsis);
				}
			}

			setState(753);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,84,_ctx) ) {
			case 1:
				{
				setState(751);
				singleExpression(0);
				}
				break;
			case 2:
				{
				setState(752);
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
		public ExpressionSequenceContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_expressionSequence; }
	}

	public final ExpressionSequenceContext expressionSequence() throws RecognitionException {
		ExpressionSequenceContext _localctx = new ExpressionSequenceContext(_ctx, getState());
		enterRule(_localctx, 110, RULE_expressionSequence);
		try {
			int _alt;
			enterOuterAlt(_localctx, 1);
			{
			setState(755);
			singleExpression(0);
			setState(760);
			_errHandler.sync(this);
			_alt = getInterpreter().adaptivePredict(_input,85,_ctx);
			while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
				if ( _alt==1 ) {
					{
					{
					setState(756);
					match(Comma);
					setState(757);
					singleExpression(0);
					}
					} 
				}
				setState(762);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,85,_ctx);
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
		public TernaryExpressionContext(SingleExpressionContext ctx) { copyFrom(ctx); }
	}
	public static class LogicalAndExpressionContext extends SingleExpressionContext {
		public List<SingleExpressionContext> singleExpression() {
			return getRuleContexts(SingleExpressionContext.class);
		}
		public SingleExpressionContext singleExpression(int i) {
			return getRuleContext(SingleExpressionContext.class,i);
		}
		public LogicalAndExpressionContext(SingleExpressionContext ctx) { copyFrom(ctx); }
	}
	public static class PowerExpressionContext extends SingleExpressionContext {
		public List<SingleExpressionContext> singleExpression() {
			return getRuleContexts(SingleExpressionContext.class);
		}
		public SingleExpressionContext singleExpression(int i) {
			return getRuleContext(SingleExpressionContext.class,i);
		}
		public PowerExpressionContext(SingleExpressionContext ctx) { copyFrom(ctx); }
	}
	public static class PreIncrementExpressionContext extends SingleExpressionContext {
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
		public LogicalOrExpressionContext(SingleExpressionContext ctx) { copyFrom(ctx); }
	}
	public static class NotExpressionContext extends SingleExpressionContext {
		public SingleExpressionContext singleExpression() {
			return getRuleContext(SingleExpressionContext.class,0);
		}
		public NotExpressionContext(SingleExpressionContext ctx) { copyFrom(ctx); }
	}
	public static class PreDecreaseExpressionContext extends SingleExpressionContext {
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
		public AssignmentExpressionContext(SingleExpressionContext ctx) { copyFrom(ctx); }
	}
	public static class PostDecreaseExpressionContext extends SingleExpressionContext {
		public SingleExpressionContext singleExpression() {
			return getRuleContext(SingleExpressionContext.class,0);
		}
		public PostDecreaseExpressionContext(SingleExpressionContext ctx) { copyFrom(ctx); }
	}
	public static class MemberNewExpressionContext extends SingleExpressionContext {
		public TerminalNode New() { return getToken(ECMAScriptParser.New, 0); }
		public SingleExpressionContext singleExpression() {
			return getRuleContext(SingleExpressionContext.class,0);
		}
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
		public SingleExpressionContext singleExpression() {
			return getRuleContext(SingleExpressionContext.class,0);
		}
		public ImportExpressionContext(SingleExpressionContext ctx) { copyFrom(ctx); }
	}
	public static class EqualityExpressionContext extends SingleExpressionContext {
		public List<SingleExpressionContext> singleExpression() {
			return getRuleContexts(SingleExpressionContext.class);
		}
		public SingleExpressionContext singleExpression(int i) {
			return getRuleContext(SingleExpressionContext.class,i);
		}
		public EqualityExpressionContext(SingleExpressionContext ctx) { copyFrom(ctx); }
	}
	public static class BitXOrExpressionContext extends SingleExpressionContext {
		public List<SingleExpressionContext> singleExpression() {
			return getRuleContexts(SingleExpressionContext.class);
		}
		public SingleExpressionContext singleExpression(int i) {
			return getRuleContext(SingleExpressionContext.class,i);
		}
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
		public MultiplicativeExpressionContext(SingleExpressionContext ctx) { copyFrom(ctx); }
	}
	public static class BitShiftExpressionContext extends SingleExpressionContext {
		public List<SingleExpressionContext> singleExpression() {
			return getRuleContexts(SingleExpressionContext.class);
		}
		public SingleExpressionContext singleExpression(int i) {
			return getRuleContext(SingleExpressionContext.class,i);
		}
		public BitShiftExpressionContext(SingleExpressionContext ctx) { copyFrom(ctx); }
	}
	public static class ParenthesizedExpressionContext extends SingleExpressionContext {
		public ExpressionSequenceContext expressionSequence() {
			return getRuleContext(ExpressionSequenceContext.class,0);
		}
		public ParenthesizedExpressionContext(SingleExpressionContext ctx) { copyFrom(ctx); }
	}
	public static class AdditiveExpressionContext extends SingleExpressionContext {
		public List<SingleExpressionContext> singleExpression() {
			return getRuleContexts(SingleExpressionContext.class);
		}
		public SingleExpressionContext singleExpression(int i) {
			return getRuleContext(SingleExpressionContext.class,i);
		}
		public AdditiveExpressionContext(SingleExpressionContext ctx) { copyFrom(ctx); }
	}
	public static class RelationalExpressionContext extends SingleExpressionContext {
		public List<SingleExpressionContext> singleExpression() {
			return getRuleContexts(SingleExpressionContext.class);
		}
		public SingleExpressionContext singleExpression(int i) {
			return getRuleContext(SingleExpressionContext.class,i);
		}
		public RelationalExpressionContext(SingleExpressionContext ctx) { copyFrom(ctx); }
	}
	public static class PostIncrementExpressionContext extends SingleExpressionContext {
		public SingleExpressionContext singleExpression() {
			return getRuleContext(SingleExpressionContext.class,0);
		}
		public PostIncrementExpressionContext(SingleExpressionContext ctx) { copyFrom(ctx); }
	}
	public static class YieldExpressionContext extends SingleExpressionContext {
		public TerminalNode Yield() { return getToken(ECMAScriptParser.Yield, 0); }
		public ExpressionSequenceContext expressionSequence() {
			return getRuleContext(ExpressionSequenceContext.class,0);
		}
		public YieldExpressionContext(SingleExpressionContext ctx) { copyFrom(ctx); }
	}
	public static class BitNotExpressionContext extends SingleExpressionContext {
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
		public IdentifierNameContext identifierName() {
			return getRuleContext(IdentifierNameContext.class,0);
		}
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
		public ExpressionSequenceContext expressionSequence() {
			return getRuleContext(ExpressionSequenceContext.class,0);
		}
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
		public BitAndExpressionContext(SingleExpressionContext ctx) { copyFrom(ctx); }
	}
	public static class BitOrExpressionContext extends SingleExpressionContext {
		public List<SingleExpressionContext> singleExpression() {
			return getRuleContexts(SingleExpressionContext.class);
		}
		public SingleExpressionContext singleExpression(int i) {
			return getRuleContext(SingleExpressionContext.class,i);
		}
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
		int _startState = 112;
		enterRecursionRule(_localctx, 112, RULE_singleExpression, _p);
		int _la;
		try {
			int _alt;
			enterOuterAlt(_localctx, 1);
			{
			setState(832);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,90,_ctx) ) {
			case 1:
				{
				_localctx = new FunctionExpressionContext(_localctx);
				_ctx = _localctx;
				_prevctx = _localctx;

				setState(764);
				anoymousFunction();
				}
				break;
			case 2:
				{
				_localctx = new ClassExpressionContext(_localctx);
				_ctx = _localctx;
				_prevctx = _localctx;
				setState(765);
				match(Class);
				setState(767);
				_errHandler.sync(this);
				_la = _input.LA(1);
				if (((((_la - 106)) & ~0x3f) == 0 && ((1L << (_la - 106)) & ((1L << (Async - 106)) | (1L << (NonStrictLet - 106)) | (1L << (Identifier - 106)))) != 0)) {
					{
					setState(766);
					identifier();
					}
				}

				setState(769);
				classTail();
				}
				break;
			case 3:
				{
				_localctx = new MemberNewExpressionContext(_localctx);
				_ctx = _localctx;
				_prevctx = _localctx;
				setState(770);
				match(New);
				setState(771);
				singleExpression(0);
				setState(772);
				match(Dot);
				setState(773);
				identifierName();
				setState(774);
				arguments();
				}
				break;
			case 4:
				{
				_localctx = new NewExpressionContext(_localctx);
				_ctx = _localctx;
				_prevctx = _localctx;
				setState(776);
				match(New);
				setState(777);
				singleExpression(0);
				setState(778);
				arguments();
				}
				break;
			case 5:
				{
				_localctx = new NewExpressionContext(_localctx);
				_ctx = _localctx;
				_prevctx = _localctx;
				setState(780);
				match(New);
				setState(781);
				singleExpression(0);
				setState(783);
				_errHandler.sync(this);
				switch ( getInterpreter().adaptivePredict(_input,87,_ctx) ) {
				case 1:
					{
					setState(782);
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
				setState(785);
				match(New);
				setState(786);
				match(Dot);
				setState(787);
				identifier();
				}
				break;
			case 7:
				{
				_localctx = new DeleteExpressionContext(_localctx);
				_ctx = _localctx;
				_prevctx = _localctx;
				setState(788);
				match(Delete);
				setState(789);
				singleExpression(38);
				}
				break;
			case 8:
				{
				_localctx = new VoidExpressionContext(_localctx);
				_ctx = _localctx;
				_prevctx = _localctx;
				setState(790);
				match(Void);
				setState(791);
				singleExpression(37);
				}
				break;
			case 9:
				{
				_localctx = new TypeofExpressionContext(_localctx);
				_ctx = _localctx;
				_prevctx = _localctx;
				setState(792);
				match(Typeof);
				setState(793);
				singleExpression(36);
				}
				break;
			case 10:
				{
				_localctx = new PreIncrementExpressionContext(_localctx);
				_ctx = _localctx;
				_prevctx = _localctx;
				setState(794);
				match(PlusPlus);
				setState(795);
				singleExpression(35);
				}
				break;
			case 11:
				{
				_localctx = new PreDecreaseExpressionContext(_localctx);
				_ctx = _localctx;
				_prevctx = _localctx;
				setState(796);
				match(MinusMinus);
				setState(797);
				singleExpression(34);
				}
				break;
			case 12:
				{
				_localctx = new UnaryPlusExpressionContext(_localctx);
				_ctx = _localctx;
				_prevctx = _localctx;
				setState(798);
				match(Plus);
				setState(799);
				singleExpression(33);
				}
				break;
			case 13:
				{
				_localctx = new UnaryMinusExpressionContext(_localctx);
				_ctx = _localctx;
				_prevctx = _localctx;
				setState(800);
				match(Minus);
				setState(801);
				singleExpression(32);
				}
				break;
			case 14:
				{
				_localctx = new BitNotExpressionContext(_localctx);
				_ctx = _localctx;
				_prevctx = _localctx;
				setState(802);
				match(BitNot);
				setState(803);
				singleExpression(31);
				}
				break;
			case 15:
				{
				_localctx = new NotExpressionContext(_localctx);
				_ctx = _localctx;
				_prevctx = _localctx;
				setState(804);
				match(Not);
				setState(805);
				singleExpression(30);
				}
				break;
			case 16:
				{
				_localctx = new AwaitExpressionContext(_localctx);
				_ctx = _localctx;
				_prevctx = _localctx;
				setState(806);
				match(Await);
				setState(807);
				singleExpression(29);
				}
				break;
			case 17:
				{
				_localctx = new ImportExpressionContext(_localctx);
				_ctx = _localctx;
				_prevctx = _localctx;
				setState(808);
				match(Import);
				setState(809);
				match(OpenParen);
				setState(810);
				singleExpression(0);
				setState(811);
				match(CloseParen);
				}
				break;
			case 18:
				{
				_localctx = new ThisExpressionContext(_localctx);
				_ctx = _localctx;
				_prevctx = _localctx;
				setState(813);
				match(This);
				}
				break;
			case 19:
				{
				_localctx = new YieldExpressionContext(_localctx);
				_ctx = _localctx;
				_prevctx = _localctx;
				setState(814);
				match(Yield);
				setState(820);
				_errHandler.sync(this);
				switch ( getInterpreter().adaptivePredict(_input,89,_ctx) ) {
				case 1:
					{
					setState(815);
					if (!(this.notLineTerminator())) throw new FailedPredicateException(this, "this.notLineTerminator()");
					setState(817);
					_errHandler.sync(this);
					_la = _input.LA(1);
					if (_la==Multiply) {
						{
						setState(816);
						match(Multiply);
						}
					}

					setState(819);
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
				setState(822);
				identifier();
				}
				break;
			case 21:
				{
				_localctx = new SuperExpressionContext(_localctx);
				_ctx = _localctx;
				_prevctx = _localctx;
				setState(823);
				match(Super);
				}
				break;
			case 22:
				{
				_localctx = new LiteralExpressionContext(_localctx);
				_ctx = _localctx;
				_prevctx = _localctx;
				setState(824);
				literal();
				}
				break;
			case 23:
				{
				_localctx = new ArrayLiteralExpressionContext(_localctx);
				_ctx = _localctx;
				_prevctx = _localctx;
				setState(825);
				arrayLiteral();
				}
				break;
			case 24:
				{
				_localctx = new ObjectLiteralExpressionContext(_localctx);
				_ctx = _localctx;
				_prevctx = _localctx;
				setState(826);
				objectLiteral();
				}
				break;
			case 25:
				{
				_localctx = new ParenthesizedExpressionContext(_localctx);
				_ctx = _localctx;
				_prevctx = _localctx;
				setState(827);
				match(OpenParen);
				setState(828);
				expressionSequence();
				setState(829);
				match(CloseParen);
				}
				break;
			case 26:
				{
				_localctx = new InlinedQueryExpressionContext(_localctx);
				_ctx = _localctx;
				_prevctx = _localctx;
				setState(831);
				queryExpression();
				}
				break;
			}
			_ctx.stop = _input.LT(-1);
			setState(915);
			_errHandler.sync(this);
			_alt = getInterpreter().adaptivePredict(_input,94,_ctx);
			while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
				if ( _alt==1 ) {
					if ( _parseListeners!=null ) triggerExitRuleEvent();
					_prevctx = _localctx;
					{
					setState(913);
					_errHandler.sync(this);
					switch ( getInterpreter().adaptivePredict(_input,93,_ctx) ) {
					case 1:
						{
						_localctx = new PowerExpressionContext(new SingleExpressionContext(_parentctx, _parentState));
						pushNewRecursionContext(_localctx, _startState, RULE_singleExpression);
						setState(834);
						if (!(precpred(_ctx, 28))) throw new FailedPredicateException(this, "precpred(_ctx, 28)");
						setState(835);
						match(Power);
						setState(836);
						singleExpression(28);
						}
						break;
					case 2:
						{
						_localctx = new MultiplicativeExpressionContext(new SingleExpressionContext(_parentctx, _parentState));
						pushNewRecursionContext(_localctx, _startState, RULE_singleExpression);
						setState(837);
						if (!(precpred(_ctx, 27))) throw new FailedPredicateException(this, "precpred(_ctx, 27)");
						setState(838);
						_la = _input.LA(1);
						if ( !((((_la) & ~0x3f) == 0 && ((1L << _la) & ((1L << Multiply) | (1L << Divide) | (1L << Modulus))) != 0)) ) {
						_errHandler.recoverInline(this);
						}
						else {
							if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
							_errHandler.reportMatch(this);
							consume();
						}
						setState(839);
						singleExpression(28);
						}
						break;
					case 3:
						{
						_localctx = new AdditiveExpressionContext(new SingleExpressionContext(_parentctx, _parentState));
						pushNewRecursionContext(_localctx, _startState, RULE_singleExpression);
						setState(840);
						if (!(precpred(_ctx, 26))) throw new FailedPredicateException(this, "precpred(_ctx, 26)");
						setState(841);
						_la = _input.LA(1);
						if ( !(_la==Plus || _la==Minus) ) {
						_errHandler.recoverInline(this);
						}
						else {
							if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
							_errHandler.reportMatch(this);
							consume();
						}
						setState(842);
						singleExpression(27);
						}
						break;
					case 4:
						{
						_localctx = new CoalesceExpressionContext(new SingleExpressionContext(_parentctx, _parentState));
						pushNewRecursionContext(_localctx, _startState, RULE_singleExpression);
						setState(843);
						if (!(precpred(_ctx, 25))) throw new FailedPredicateException(this, "precpred(_ctx, 25)");
						setState(844);
						match(NullCoalesce);
						setState(845);
						singleExpression(26);
						}
						break;
					case 5:
						{
						_localctx = new BitShiftExpressionContext(new SingleExpressionContext(_parentctx, _parentState));
						pushNewRecursionContext(_localctx, _startState, RULE_singleExpression);
						setState(846);
						if (!(precpred(_ctx, 24))) throw new FailedPredicateException(this, "precpred(_ctx, 24)");
						setState(847);
						_la = _input.LA(1);
						if ( !((((_la) & ~0x3f) == 0 && ((1L << _la) & ((1L << RightShiftArithmetic) | (1L << LeftShiftArithmetic) | (1L << RightShiftLogical))) != 0)) ) {
						_errHandler.recoverInline(this);
						}
						else {
							if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
							_errHandler.reportMatch(this);
							consume();
						}
						setState(848);
						singleExpression(25);
						}
						break;
					case 6:
						{
						_localctx = new RelationalExpressionContext(new SingleExpressionContext(_parentctx, _parentState));
						pushNewRecursionContext(_localctx, _startState, RULE_singleExpression);
						setState(849);
						if (!(precpred(_ctx, 23))) throw new FailedPredicateException(this, "precpred(_ctx, 23)");
						setState(850);
						_la = _input.LA(1);
						if ( !((((_la) & ~0x3f) == 0 && ((1L << _la) & ((1L << LessThan) | (1L << MoreThan) | (1L << LessThanEquals) | (1L << GreaterThanEquals))) != 0)) ) {
						_errHandler.recoverInline(this);
						}
						else {
							if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
							_errHandler.reportMatch(this);
							consume();
						}
						setState(851);
						singleExpression(24);
						}
						break;
					case 7:
						{
						_localctx = new InstanceofExpressionContext(new SingleExpressionContext(_parentctx, _parentState));
						pushNewRecursionContext(_localctx, _startState, RULE_singleExpression);
						setState(852);
						if (!(precpred(_ctx, 22))) throw new FailedPredicateException(this, "precpred(_ctx, 22)");
						setState(853);
						match(Instanceof);
						setState(854);
						singleExpression(23);
						}
						break;
					case 8:
						{
						_localctx = new InExpressionContext(new SingleExpressionContext(_parentctx, _parentState));
						pushNewRecursionContext(_localctx, _startState, RULE_singleExpression);
						setState(855);
						if (!(precpred(_ctx, 21))) throw new FailedPredicateException(this, "precpred(_ctx, 21)");
						setState(856);
						match(In);
						setState(857);
						singleExpression(22);
						}
						break;
					case 9:
						{
						_localctx = new EqualityExpressionContext(new SingleExpressionContext(_parentctx, _parentState));
						pushNewRecursionContext(_localctx, _startState, RULE_singleExpression);
						setState(858);
						if (!(precpred(_ctx, 20))) throw new FailedPredicateException(this, "precpred(_ctx, 20)");
						setState(859);
						_la = _input.LA(1);
						if ( !((((_la) & ~0x3f) == 0 && ((1L << _la) & ((1L << Equals_) | (1L << NotEquals) | (1L << IdentityEquals) | (1L << IdentityNotEquals))) != 0)) ) {
						_errHandler.recoverInline(this);
						}
						else {
							if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
							_errHandler.reportMatch(this);
							consume();
						}
						setState(860);
						singleExpression(21);
						}
						break;
					case 10:
						{
						_localctx = new BitAndExpressionContext(new SingleExpressionContext(_parentctx, _parentState));
						pushNewRecursionContext(_localctx, _startState, RULE_singleExpression);
						setState(861);
						if (!(precpred(_ctx, 19))) throw new FailedPredicateException(this, "precpred(_ctx, 19)");
						setState(862);
						match(BitAnd);
						setState(863);
						singleExpression(20);
						}
						break;
					case 11:
						{
						_localctx = new BitXOrExpressionContext(new SingleExpressionContext(_parentctx, _parentState));
						pushNewRecursionContext(_localctx, _startState, RULE_singleExpression);
						setState(864);
						if (!(precpred(_ctx, 18))) throw new FailedPredicateException(this, "precpred(_ctx, 18)");
						setState(865);
						match(BitXOr);
						setState(866);
						singleExpression(19);
						}
						break;
					case 12:
						{
						_localctx = new BitOrExpressionContext(new SingleExpressionContext(_parentctx, _parentState));
						pushNewRecursionContext(_localctx, _startState, RULE_singleExpression);
						setState(867);
						if (!(precpred(_ctx, 17))) throw new FailedPredicateException(this, "precpred(_ctx, 17)");
						setState(868);
						match(BitOr);
						setState(869);
						singleExpression(18);
						}
						break;
					case 13:
						{
						_localctx = new LogicalAndExpressionContext(new SingleExpressionContext(_parentctx, _parentState));
						pushNewRecursionContext(_localctx, _startState, RULE_singleExpression);
						setState(870);
						if (!(precpred(_ctx, 16))) throw new FailedPredicateException(this, "precpred(_ctx, 16)");
						setState(871);
						match(And);
						setState(872);
						singleExpression(17);
						}
						break;
					case 14:
						{
						_localctx = new LogicalOrExpressionContext(new SingleExpressionContext(_parentctx, _parentState));
						pushNewRecursionContext(_localctx, _startState, RULE_singleExpression);
						setState(873);
						if (!(precpred(_ctx, 15))) throw new FailedPredicateException(this, "precpred(_ctx, 15)");
						setState(874);
						match(Or);
						setState(875);
						singleExpression(16);
						}
						break;
					case 15:
						{
						_localctx = new TernaryExpressionContext(new SingleExpressionContext(_parentctx, _parentState));
						pushNewRecursionContext(_localctx, _startState, RULE_singleExpression);
						setState(876);
						if (!(precpred(_ctx, 14))) throw new FailedPredicateException(this, "precpred(_ctx, 14)");
						setState(877);
						match(QuestionMark);
						setState(878);
						singleExpression(0);
						setState(879);
						match(Colon);
						setState(880);
						singleExpression(15);
						}
						break;
					case 16:
						{
						_localctx = new AssignmentExpressionContext(new SingleExpressionContext(_parentctx, _parentState));
						pushNewRecursionContext(_localctx, _startState, RULE_singleExpression);
						setState(882);
						if (!(precpred(_ctx, 13))) throw new FailedPredicateException(this, "precpred(_ctx, 13)");
						setState(883);
						match(Assign);
						setState(884);
						singleExpression(13);
						}
						break;
					case 17:
						{
						_localctx = new AssignmentOperatorExpressionContext(new SingleExpressionContext(_parentctx, _parentState));
						pushNewRecursionContext(_localctx, _startState, RULE_singleExpression);
						setState(885);
						if (!(precpred(_ctx, 12))) throw new FailedPredicateException(this, "precpred(_ctx, 12)");
						setState(886);
						assignmentOperator();
						setState(887);
						singleExpression(12);
						}
						break;
					case 18:
						{
						_localctx = new MemberIndexExpressionContext(new SingleExpressionContext(_parentctx, _parentState));
						pushNewRecursionContext(_localctx, _startState, RULE_singleExpression);
						setState(889);
						if (!(precpred(_ctx, 47))) throw new FailedPredicateException(this, "precpred(_ctx, 47)");
						setState(890);
						match(OpenBracket);
						setState(891);
						expressionSequence();
						setState(892);
						match(CloseBracket);
						}
						break;
					case 19:
						{
						_localctx = new MemberDotExpressionContext(new SingleExpressionContext(_parentctx, _parentState));
						pushNewRecursionContext(_localctx, _startState, RULE_singleExpression);
						setState(894);
						if (!(precpred(_ctx, 45))) throw new FailedPredicateException(this, "precpred(_ctx, 45)");
						setState(896);
						_errHandler.sync(this);
						_la = _input.LA(1);
						if (_la==QuestionMark) {
							{
							setState(895);
							match(QuestionMark);
							}
						}

						setState(898);
						match(Dot);
						setState(900);
						_errHandler.sync(this);
						_la = _input.LA(1);
						if (_la==Hashtag) {
							{
							setState(899);
							match(Hashtag);
							}
						}

						setState(902);
						identifierName();
						}
						break;
					case 20:
						{
						_localctx = new ArgumentsExpressionContext(new SingleExpressionContext(_parentctx, _parentState));
						pushNewRecursionContext(_localctx, _startState, RULE_singleExpression);
						setState(903);
						if (!(precpred(_ctx, 41))) throw new FailedPredicateException(this, "precpred(_ctx, 41)");
						setState(904);
						arguments();
						}
						break;
					case 21:
						{
						_localctx = new PostIncrementExpressionContext(new SingleExpressionContext(_parentctx, _parentState));
						pushNewRecursionContext(_localctx, _startState, RULE_singleExpression);
						setState(905);
						if (!(precpred(_ctx, 40))) throw new FailedPredicateException(this, "precpred(_ctx, 40)");
						setState(906);
						if (!(this.notLineTerminator())) throw new FailedPredicateException(this, "this.notLineTerminator()");
						setState(907);
						match(PlusPlus);
						}
						break;
					case 22:
						{
						_localctx = new PostDecreaseExpressionContext(new SingleExpressionContext(_parentctx, _parentState));
						pushNewRecursionContext(_localctx, _startState, RULE_singleExpression);
						setState(908);
						if (!(precpred(_ctx, 39))) throw new FailedPredicateException(this, "precpred(_ctx, 39)");
						setState(909);
						if (!(this.notLineTerminator())) throw new FailedPredicateException(this, "this.notLineTerminator()");
						setState(910);
						match(MinusMinus);
						}
						break;
					case 23:
						{
						_localctx = new TemplateStringExpressionContext(new SingleExpressionContext(_parentctx, _parentState));
						pushNewRecursionContext(_localctx, _startState, RULE_singleExpression);
						setState(911);
						if (!(precpred(_ctx, 10))) throw new FailedPredicateException(this, "precpred(_ctx, 10)");
						setState(912);
						match(TemplateStringLiteral);
						}
						break;
					}
					} 
				}
				setState(917);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,94,_ctx);
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
		enterRule(_localctx, 114, RULE_assignable);
		try {
			setState(921);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case Async:
			case NonStrictLet:
			case Identifier:
				enterOuterAlt(_localctx, 1);
				{
				setState(918);
				identifier();
				}
				break;
			case OpenBracket:
				enterOuterAlt(_localctx, 2);
				{
				setState(919);
				arrayLiteral();
				}
				break;
			case OpenBrace:
				enterOuterAlt(_localctx, 3);
				{
				setState(920);
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
		public List<PropertyAssignmentContext> propertyAssignment() {
			return getRuleContexts(PropertyAssignmentContext.class);
		}
		public PropertyAssignmentContext propertyAssignment(int i) {
			return getRuleContext(PropertyAssignmentContext.class,i);
		}
		public ObjectLiteralContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_objectLiteral; }
	}

	public final ObjectLiteralContext objectLiteral() throws RecognitionException {
		ObjectLiteralContext _localctx = new ObjectLiteralContext(_ctx, getState());
		enterRule(_localctx, 116, RULE_objectLiteral);
		int _la;
		try {
			int _alt;
			enterOuterAlt(_localctx, 1);
			{
			setState(923);
			match(OpenBrace);
			setState(932);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,97,_ctx) ) {
			case 1:
				{
				setState(924);
				propertyAssignment();
				setState(929);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,96,_ctx);
				while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
					if ( _alt==1 ) {
						{
						{
						setState(925);
						match(Comma);
						setState(926);
						propertyAssignment();
						}
						} 
					}
					setState(931);
					_errHandler.sync(this);
					_alt = getInterpreter().adaptivePredict(_input,96,_ctx);
				}
				}
				break;
			}
			setState(935);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==Comma) {
				{
				setState(934);
				match(Comma);
				}
			}

			setState(937);
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
		public FunctionBodyContext functionBody() {
			return getRuleContext(FunctionBodyContext.class,0);
		}
		public TerminalNode Async() { return getToken(ECMAScriptParser.Async, 0); }
		public FormalParameterListContext formalParameterList() {
			return getRuleContext(FormalParameterListContext.class,0);
		}
		public AnoymousFunctionDeclContext(AnoymousFunctionContext ctx) { copyFrom(ctx); }
	}
	public static class ArrowFunctionContext extends AnoymousFunctionContext {
		public ArrowFunctionParametersContext arrowFunctionParameters() {
			return getRuleContext(ArrowFunctionParametersContext.class,0);
		}
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
		enterRule(_localctx, 118, RULE_anoymousFunction);
		int _la;
		try {
			setState(963);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,103,_ctx) ) {
			case 1:
				_localctx = new FunctionDeclContext(_localctx);
				enterOuterAlt(_localctx, 1);
				{
				setState(939);
				functionDeclaration();
				}
				break;
			case 2:
				_localctx = new AnoymousFunctionDeclContext(_localctx);
				enterOuterAlt(_localctx, 2);
				{
				setState(941);
				_errHandler.sync(this);
				_la = _input.LA(1);
				if (_la==Async) {
					{
					setState(940);
					match(Async);
					}
				}

				setState(943);
				match(Function);
				setState(945);
				_errHandler.sync(this);
				_la = _input.LA(1);
				if (_la==Multiply) {
					{
					setState(944);
					match(Multiply);
					}
				}

				setState(947);
				match(OpenParen);
				setState(949);
				_errHandler.sync(this);
				_la = _input.LA(1);
				if ((((_la) & ~0x3f) == 0 && ((1L << _la) & ((1L << OpenBracket) | (1L << OpenBrace) | (1L << Ellipsis))) != 0) || ((((_la - 106)) & ~0x3f) == 0 && ((1L << (_la - 106)) & ((1L << (Async - 106)) | (1L << (NonStrictLet - 106)) | (1L << (Identifier - 106)))) != 0)) {
					{
					setState(948);
					formalParameterList();
					}
				}

				setState(951);
				match(CloseParen);
				setState(952);
				match(OpenBrace);
				setState(953);
				functionBody();
				setState(954);
				match(CloseBrace);
				}
				break;
			case 3:
				_localctx = new ArrowFunctionContext(_localctx);
				enterOuterAlt(_localctx, 3);
				{
				setState(957);
				_errHandler.sync(this);
				switch ( getInterpreter().adaptivePredict(_input,102,_ctx) ) {
				case 1:
					{
					setState(956);
					match(Async);
					}
					break;
				}
				setState(959);
				arrowFunctionParameters();
				setState(960);
				match(ARROW);
				setState(961);
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
		enterRule(_localctx, 120, RULE_arrowFunctionParameters);
		int _la;
		try {
			setState(971);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case Async:
			case NonStrictLet:
			case Identifier:
				enterOuterAlt(_localctx, 1);
				{
				setState(965);
				identifier();
				}
				break;
			case OpenParen:
				enterOuterAlt(_localctx, 2);
				{
				setState(966);
				match(OpenParen);
				setState(968);
				_errHandler.sync(this);
				_la = _input.LA(1);
				if ((((_la) & ~0x3f) == 0 && ((1L << _la) & ((1L << OpenBracket) | (1L << OpenBrace) | (1L << Ellipsis))) != 0) || ((((_la - 106)) & ~0x3f) == 0 && ((1L << (_la - 106)) & ((1L << (Async - 106)) | (1L << (NonStrictLet - 106)) | (1L << (Identifier - 106)))) != 0)) {
					{
					setState(967);
					formalParameterList();
					}
				}

				setState(970);
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
		public FunctionBodyContext functionBody() {
			return getRuleContext(FunctionBodyContext.class,0);
		}
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
		enterRule(_localctx, 122, RULE_arrowFunctionBody);
		try {
			setState(978);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,106,_ctx) ) {
			case 1:
				enterOuterAlt(_localctx, 1);
				{
				setState(973);
				match(OpenBrace);
				setState(974);
				functionBody();
				setState(975);
				match(CloseBrace);
				}
				break;
			case 2:
				enterOuterAlt(_localctx, 2);
				{
				setState(977);
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
		public AssignmentOperatorContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_assignmentOperator; }
	}

	public final AssignmentOperatorContext assignmentOperator() throws RecognitionException {
		AssignmentOperatorContext _localctx = new AssignmentOperatorContext(_ctx, getState());
		enterRule(_localctx, 124, RULE_assignmentOperator);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(980);
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
		enterRule(_localctx, 126, RULE_literal);
		try {
			setState(989);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case NullLiteral:
				enterOuterAlt(_localctx, 1);
				{
				setState(982);
				match(NullLiteral);
				}
				break;
			case BooleanLiteral:
				enterOuterAlt(_localctx, 2);
				{
				setState(983);
				match(BooleanLiteral);
				}
				break;
			case StringLiteral:
				enterOuterAlt(_localctx, 3);
				{
				setState(984);
				match(StringLiteral);
				}
				break;
			case TemplateStringLiteral:
				enterOuterAlt(_localctx, 4);
				{
				setState(985);
				match(TemplateStringLiteral);
				}
				break;
			case RegularExpressionLiteral:
				enterOuterAlt(_localctx, 5);
				{
				setState(986);
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
				setState(987);
				numericLiteral();
				}
				break;
			case BigHexIntegerLiteral:
			case BigOctalIntegerLiteral:
			case BigBinaryIntegerLiteral:
			case BigDecimalIntegerLiteral:
				enterOuterAlt(_localctx, 7);
				{
				setState(988);
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
		enterRule(_localctx, 128, RULE_numericLiteral);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(991);
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
		enterRule(_localctx, 130, RULE_bigintLiteral);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(993);
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
		enterRule(_localctx, 132, RULE_getter);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(995);
			if (!(this.n("get"))) throw new FailedPredicateException(this, "this.n(\"get\")");
			setState(996);
			identifier();
			setState(997);
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
		enterRule(_localctx, 134, RULE_setter);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(999);
			if (!(this.n("set"))) throw new FailedPredicateException(this, "this.n(\"set\")");
			setState(1000);
			identifier();
			setState(1001);
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
		enterRule(_localctx, 136, RULE_identifierName);
		try {
			setState(1005);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case Identifier:
				enterOuterAlt(_localctx, 1);
				{
				setState(1003);
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
				setState(1004);
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
		enterRule(_localctx, 138, RULE_identifier);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(1007);
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
		enterRule(_localctx, 140, RULE_reservedWord);
		try {
			setState(1012);
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
				setState(1009);
				keyword();
				}
				break;
			case NullLiteral:
				enterOuterAlt(_localctx, 2);
				{
				setState(1010);
				match(NullLiteral);
				}
				break;
			case BooleanLiteral:
				enterOuterAlt(_localctx, 3);
				{
				setState(1011);
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
		enterRule(_localctx, 142, RULE_keyword);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(1014);
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
		enterRule(_localctx, 144, RULE_eos);
		try {
			setState(1020);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,110,_ctx) ) {
			case 1:
				enterOuterAlt(_localctx, 1);
				{
				setState(1016);
				match(SemiColon);
				}
				break;
			case 2:
				enterOuterAlt(_localctx, 2);
				{
				setState(1017);
				match(EOF);
				}
				break;
			case 3:
				enterOuterAlt(_localctx, 3);
				{
				setState(1018);
				if (!(this.lineTerminatorAhead())) throw new FailedPredicateException(this, "this.lineTerminatorAhead()");
				}
				break;
			case 4:
				enterOuterAlt(_localctx, 4);
				{
				setState(1019);
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
		enterRule(_localctx, 146, RULE_querySelectStatement);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(1022);
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
		public QueryExpressionContext queryExpression() {
			return getRuleContext(QueryExpressionContext.class,0);
		}
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
		enterRule(_localctx, 148, RULE_queryExpression);
		try {
			int _alt;
			enterOuterAlt(_localctx, 1);
			{
			setState(1029);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case Select:
			case Using:
				{
				setState(1024);
				querySpecification();
				}
				break;
			case OpenParen:
				{
				setState(1025);
				match(OpenParen);
				setState(1026);
				queryExpression();
				setState(1027);
				match(CloseParen);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			setState(1034);
			_errHandler.sync(this);
			_alt = getInterpreter().adaptivePredict(_input,112,_ctx);
			while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
				if ( _alt==1 ) {
					{
					{
					setState(1031);
					sql_union();
					}
					} 
				}
				setState(1036);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,112,_ctx);
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
		public QueryExpressionContext queryExpression() {
			return getRuleContext(QueryExpressionContext.class,0);
		}
		public TerminalNode All() { return getToken(ECMAScriptParser.All, 0); }
		public QueryUnionExpressionContext(Sql_unionContext ctx) { copyFrom(ctx); }
	}

	public final Sql_unionContext sql_union() throws RecognitionException {
		Sql_unionContext _localctx = new Sql_unionContext(_ctx, getState());
		enterRule(_localctx, 150, RULE_sql_union);
		int _la;
		try {
			_localctx = new QueryUnionExpressionContext(_localctx);
			enterOuterAlt(_localctx, 1);
			{
			{
			setState(1037);
			match(Union);
			setState(1039);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==All) {
				{
				setState(1038);
				match(All);
				}
			}

			}
			setState(1046);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case Select:
			case Using:
				{
				setState(1041);
				querySpecification();
				}
				break;
			case OpenParen:
				{
				{
				setState(1042);
				match(OpenParen);
				setState(1043);
				queryExpression();
				setState(1044);
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
		enterRule(_localctx, 152, RULE_querySpecification);
		int _la;
		try {
			_localctx = new QuerySelectExpressionContext(_localctx);
			enterOuterAlt(_localctx, 1);
			{
			setState(1049);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==Using) {
				{
				setState(1048);
				bind_clause();
				}
			}

			setState(1051);
			match(Select);
			setState(1052);
			select_list();
			setState(1054);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,116,_ctx) ) {
			case 1:
				{
				setState(1053);
				withinClause();
				}
				break;
			}
			setState(1057);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,117,_ctx) ) {
			case 1:
				{
				setState(1056);
				fromClause();
				}
				break;
			}
			setState(1060);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,118,_ctx) ) {
			case 1:
				{
				setState(1059);
				whereClause();
				}
				break;
			}
			setState(1063);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,119,_ctx) ) {
			case 1:
				{
				setState(1062);
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
		public QuerySelectListExpressionContext(Select_listContext ctx) { copyFrom(ctx); }
	}

	public final Select_listContext select_list() throws RecognitionException {
		Select_listContext _localctx = new Select_listContext(_ctx, getState());
		enterRule(_localctx, 154, RULE_select_list);
		try {
			int _alt;
			_localctx = new QuerySelectListExpressionContext(_localctx);
			enterOuterAlt(_localctx, 1);
			{
			setState(1065);
			select_list_elem();
			setState(1070);
			_errHandler.sync(this);
			_alt = getInterpreter().adaptivePredict(_input,120,_ctx);
			while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
				if ( _alt==1 ) {
					{
					{
					setState(1066);
					match(Comma);
					setState(1067);
					select_list_elem();
					}
					} 
				}
				setState(1072);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,120,_ctx);
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
		public ArgumentContext argument() {
			return getRuleContext(ArgumentContext.class,0);
		}
		public Select_list_elemContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_select_list_elem; }
	}

	public final Select_list_elemContext select_list_elem() throws RecognitionException {
		Select_list_elemContext _localctx = new Select_list_elemContext(_ctx, getState());
		enterRule(_localctx, 156, RULE_select_list_elem);
		try {
			setState(1085);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,123,_ctx) ) {
			case 1:
				enterOuterAlt(_localctx, 1);
				{
				setState(1073);
				match(Multiply);
				}
				break;
			case 2:
				enterOuterAlt(_localctx, 2);
				{
				setState(1074);
				identifier();
				setState(1077);
				_errHandler.sync(this);
				switch ( getInterpreter().adaptivePredict(_input,121,_ctx) ) {
				case 1:
					{
					setState(1075);
					match(As);
					setState(1076);
					identifierName();
					}
					break;
				}
				}
				break;
			case 3:
				enterOuterAlt(_localctx, 3);
				{
				setState(1079);
				singleExpression(0);
				setState(1080);
				argument();
				setState(1083);
				_errHandler.sync(this);
				switch ( getInterpreter().adaptivePredict(_input,122,_ctx) ) {
				case 1:
					{
					setState(1081);
					match(As);
					setState(1082);
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
		enterRule(_localctx, 158, RULE_fromClause);
		try {
			_localctx = new QueryFromExpressionContext(_localctx);
			enterOuterAlt(_localctx, 1);
			{
			setState(1087);
			match(From);
			setState(1088);
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
		enterRule(_localctx, 160, RULE_whereClause);
		try {
			_localctx = new QueryWhereExpressionContext(_localctx);
			enterOuterAlt(_localctx, 1);
			{
			setState(1090);
			match(Where);
			setState(1091);
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
		public QueryDataSourcesExpressionContext(DataSourcesContext ctx) { copyFrom(ctx); }
	}

	public final DataSourcesContext dataSources() throws RecognitionException {
		DataSourcesContext _localctx = new DataSourcesContext(_ctx, getState());
		enterRule(_localctx, 162, RULE_dataSources);
		try {
			int _alt;
			_localctx = new QueryDataSourcesExpressionContext(_localctx);
			enterOuterAlt(_localctx, 1);
			{
			setState(1093);
			dataSource();
			setState(1098);
			_errHandler.sync(this);
			_alt = getInterpreter().adaptivePredict(_input,124,_ctx);
			while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
				if ( _alt==1 ) {
					{
					{
					setState(1094);
					match(Comma);
					setState(1095);
					dataSource();
					}
					} 
				}
				setState(1100);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,124,_ctx);
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
		public DataSourceContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_dataSource; }
	}

	public final DataSourceContext dataSource() throws RecognitionException {
		DataSourceContext _localctx = new DataSourceContext(_ctx, getState());
		enterRule(_localctx, 164, RULE_dataSource);
		try {
			setState(1106);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,125,_ctx) ) {
			case 1:
				enterOuterAlt(_localctx, 1);
				{
				setState(1101);
				data_source_item_joined();
				}
				break;
			case 2:
				enterOuterAlt(_localctx, 2);
				{
				setState(1102);
				match(OpenParen);
				setState(1103);
				data_source_item_joined();
				setState(1104);
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
		enterRule(_localctx, 166, RULE_data_source_item_joined);
		try {
			int _alt;
			_localctx = new QueryDataSourceExpressionContext(_localctx);
			enterOuterAlt(_localctx, 1);
			{
			setState(1108);
			data_source_item();
			setState(1110);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,126,_ctx) ) {
			case 1:
				{
				setState(1109);
				using_source_clause();
				}
				break;
			}
			setState(1115);
			_errHandler.sync(this);
			_alt = getInterpreter().adaptivePredict(_input,127,_ctx);
			while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
				if ( _alt==1 ) {
					{
					{
					setState(1112);
					join_clause();
					}
					} 
				}
				setState(1117);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,127,_ctx);
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
		public QueryExpressionContext queryExpression() {
			return getRuleContext(QueryExpressionContext.class,0);
		}
		public QueryDataSourceItemSubqueryExpressionContext(Data_source_itemContext ctx) { copyFrom(ctx); }
	}

	public final Data_source_itemContext data_source_item() throws RecognitionException {
		Data_source_itemContext _localctx = new Data_source_itemContext(_ctx, getState());
		enterRule(_localctx, 168, RULE_data_source_item);
		try {
			setState(1127);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,128,_ctx) ) {
			case 1:
				_localctx = new QueryDataSourceItemUrlExpressionContext(_localctx);
				enterOuterAlt(_localctx, 1);
				{
				setState(1118);
				match(Url);
				}
				break;
			case 2:
				_localctx = new QueryDataSourceItemArgumentsExpressionContext(_localctx);
				enterOuterAlt(_localctx, 2);
				{
				setState(1119);
				singleExpression(0);
				setState(1120);
				arguments();
				}
				break;
			case 3:
				_localctx = new QueryDataSourceItemIdentifierExpressionContext(_localctx);
				enterOuterAlt(_localctx, 3);
				{
				setState(1122);
				identifier();
				}
				break;
			case 4:
				_localctx = new QueryDataSourceItemSubqueryExpressionContext(_localctx);
				enterOuterAlt(_localctx, 4);
				{
				setState(1123);
				match(OpenParen);
				setState(1124);
				queryExpression();
				setState(1125);
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
		public QueryJoinOnExpressionContext(Join_clauseContext ctx) { copyFrom(ctx); }
	}

	public final Join_clauseContext join_clause() throws RecognitionException {
		Join_clauseContext _localctx = new Join_clauseContext(_ctx, getState());
		enterRule(_localctx, 170, RULE_join_clause);
		int _la;
		try {
			setState(1138);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,129,_ctx) ) {
			case 1:
				_localctx = new QueryJoinCrossApplyExpressionContext(_localctx);
				enterOuterAlt(_localctx, 1);
				{
				setState(1129);
				match(Join);
				setState(1130);
				dataSources();
				}
				break;
			case 2:
				_localctx = new QueryJoinOnExpressionContext(_localctx);
				enterOuterAlt(_localctx, 2);
				{
				setState(1131);
				match(Join);
				setState(1132);
				dataSources();
				setState(1133);
				match(On);
				setState(1134);
				singleExpression(0);
				setState(1135);
				_la = _input.LA(1);
				if ( !(_la==Equals_ || _la==IdentityEquals) ) {
				_errHandler.recoverInline(this);
				}
				else {
					if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
					_errHandler.reportMatch(this);
					consume();
				}
				setState(1136);
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
		enterRule(_localctx, 172, RULE_using_source_clause);
		try {
			setState(1144);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,130,_ctx) ) {
			case 1:
				_localctx = new QuerySourceUsingLiteralExpressionContext(_localctx);
				enterOuterAlt(_localctx, 1);
				{
				setState(1140);
				match(Using);
				setState(1141);
				queryObjectLiteral();
				}
				break;
			case 2:
				_localctx = new QuerySourceUsingSingleExpressionContext(_localctx);
				enterOuterAlt(_localctx, 2);
				{
				setState(1142);
				match(Using);
				setState(1143);
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
		enterRule(_localctx, 174, RULE_produce_clause);
		try {
			_localctx = new QueryProduceExpressionContext(_localctx);
			enterOuterAlt(_localctx, 1);
			{
			setState(1146);
			match(Produce);
			setState(1147);
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
		enterRule(_localctx, 176, RULE_bind_clause);
		try {
			_localctx = new QueryBindExpressionContext(_localctx);
			enterOuterAlt(_localctx, 1);
			{
			setState(1149);
			match(Using);
			setState(1150);
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
		public QueryWithinExpressionContext(WithinClauseContext ctx) { copyFrom(ctx); }
	}

	public final WithinClauseContext withinClause() throws RecognitionException {
		WithinClauseContext _localctx = new WithinClauseContext(_ctx, getState());
		enterRule(_localctx, 178, RULE_withinClause);
		try {
			int _alt;
			_localctx = new QueryWithinExpressionContext(_localctx);
			enterOuterAlt(_localctx, 1);
			{
			setState(1152);
			match(Within);
			setState(1153);
			singleExpression(0);
			setState(1158);
			_errHandler.sync(this);
			_alt = getInterpreter().adaptivePredict(_input,131,_ctx);
			while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
				if ( _alt==1 ) {
					{
					{
					setState(1154);
					match(Comma);
					setState(1155);
					singleExpression(0);
					}
					} 
				}
				setState(1160);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,131,_ctx);
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
		public List<QueryPropertyAssignmentContext> queryPropertyAssignment() {
			return getRuleContexts(QueryPropertyAssignmentContext.class);
		}
		public QueryPropertyAssignmentContext queryPropertyAssignment(int i) {
			return getRuleContext(QueryPropertyAssignmentContext.class,i);
		}
		public QueryObjectLiteralContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_queryObjectLiteral; }
	}

	public final QueryObjectLiteralContext queryObjectLiteral() throws RecognitionException {
		QueryObjectLiteralContext _localctx = new QueryObjectLiteralContext(_ctx, getState());
		enterRule(_localctx, 180, RULE_queryObjectLiteral);
		int _la;
		try {
			int _alt;
			enterOuterAlt(_localctx, 1);
			{
			setState(1161);
			match(OpenBrace);
			setState(1170);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (((((_la - 5)) & ~0x3f) == 0 && ((1L << (_la - 5)) & ((1L << (OpenBracket - 5)) | (1L << (NullLiteral - 5)) | (1L << (BooleanLiteral - 5)) | (1L << (DecimalLiteral - 5)) | (1L << (HexIntegerLiteral - 5)) | (1L << (OctalIntegerLiteral - 5)) | (1L << (OctalIntegerLiteral2 - 5)) | (1L << (BinaryIntegerLiteral - 5)))) != 0) || ((((_la - 70)) & ~0x3f) == 0 && ((1L << (_la - 70)) & ((1L << (Break - 70)) | (1L << (Do - 70)) | (1L << (Instanceof - 70)) | (1L << (Typeof - 70)) | (1L << (Case - 70)) | (1L << (Else - 70)) | (1L << (New - 70)) | (1L << (Var - 70)) | (1L << (Catch - 70)) | (1L << (Finally - 70)) | (1L << (Return - 70)) | (1L << (Void - 70)) | (1L << (Continue - 70)) | (1L << (For - 70)) | (1L << (Switch - 70)) | (1L << (While - 70)) | (1L << (Debugger - 70)) | (1L << (Function - 70)) | (1L << (This - 70)) | (1L << (With - 70)) | (1L << (Default - 70)) | (1L << (If - 70)) | (1L << (Throw - 70)) | (1L << (Delete - 70)) | (1L << (In - 70)) | (1L << (Try - 70)) | (1L << (As - 70)) | (1L << (From - 70)) | (1L << (Let - 70)) | (1L << (Class - 70)) | (1L << (Enum - 70)) | (1L << (Extends - 70)) | (1L << (Super - 70)) | (1L << (Const - 70)) | (1L << (Export - 70)) | (1L << (Import - 70)) | (1L << (Async - 70)) | (1L << (Await - 70)) | (1L << (Implements - 70)) | (1L << (Private - 70)) | (1L << (Public - 70)) | (1L << (Interface - 70)) | (1L << (Package - 70)) | (1L << (Protected - 70)) | (1L << (Static - 70)) | (1L << (Yield - 70)) | (1L << (Identifier - 70)) | (1L << (StringLiteral - 70)))) != 0)) {
				{
				setState(1162);
				queryPropertyAssignment();
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
						queryPropertyAssignment();
						}
						} 
					}
					setState(1169);
					_errHandler.sync(this);
					_alt = getInterpreter().adaptivePredict(_input,132,_ctx);
				}
				}
			}

			setState(1173);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==Comma) {
				{
				setState(1172);
				match(Comma);
				}
			}

			setState(1175);
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
		enterRule(_localctx, 182, RULE_queryPropertyAssignment);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(1177);
			propertyName();
			setState(1178);
			match(Colon);
			setState(1179);
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
		case 41:
			return classElement_sempred((ClassElementContext)_localctx, predIndex);
		case 56:
			return singleExpression_sempred((SingleExpressionContext)_localctx, predIndex);
		case 66:
			return getter_sempred((GetterContext)_localctx, predIndex);
		case 67:
			return setter_sempred((SetterContext)_localctx, predIndex);
		case 72:
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
		"\3\u608b\ua72a\u8133\ub9ed\u417c\u3be7\u7786\u5964\3\u008a\u04a0\4\2\t"+
		"\2\4\3\t\3\4\4\t\4\4\5\t\5\4\6\t\6\4\7\t\7\4\b\t\b\4\t\t\t\4\n\t\n\4\13"+
		"\t\13\4\f\t\f\4\r\t\r\4\16\t\16\4\17\t\17\4\20\t\20\4\21\t\21\4\22\t\22"+
		"\4\23\t\23\4\24\t\24\4\25\t\25\4\26\t\26\4\27\t\27\4\30\t\30\4\31\t\31"+
		"\4\32\t\32\4\33\t\33\4\34\t\34\4\35\t\35\4\36\t\36\4\37\t\37\4 \t \4!"+
		"\t!\4\"\t\"\4#\t#\4$\t$\4%\t%\4&\t&\4\'\t\'\4(\t(\4)\t)\4*\t*\4+\t+\4"+
		",\t,\4-\t-\4.\t.\4/\t/\4\60\t\60\4\61\t\61\4\62\t\62\4\63\t\63\4\64\t"+
		"\64\4\65\t\65\4\66\t\66\4\67\t\67\48\t8\49\t9\4:\t:\4;\t;\4<\t<\4=\t="+
		"\4>\t>\4?\t?\4@\t@\4A\tA\4B\tB\4C\tC\4D\tD\4E\tE\4F\tF\4G\tG\4H\tH\4I"+
		"\tI\4J\tJ\4K\tK\4L\tL\4M\tM\4N\tN\4O\tO\4P\tP\4Q\tQ\4R\tR\4S\tS\4T\tT"+
		"\4U\tU\4V\tV\4W\tW\4X\tX\4Y\tY\4Z\tZ\4[\t[\4\\\t\\\4]\t]\3\2\5\2\u00bc"+
		"\n\2\3\2\5\2\u00bf\n\2\3\2\3\2\3\3\3\3\3\4\3\4\3\4\3\4\3\4\3\4\3\4\3\4"+
		"\3\4\3\4\3\4\3\4\3\4\3\4\3\4\3\4\3\4\3\4\3\4\3\4\5\4\u00d9\n\4\3\5\3\5"+
		"\5\5\u00dd\n\5\3\5\3\5\3\6\6\6\u00e2\n\6\r\6\16\6\u00e3\3\7\3\7\3\7\3"+
		"\b\5\b\u00ea\n\b\3\b\3\b\5\b\u00ee\n\b\3\b\3\b\3\b\3\b\3\b\5\b\u00f5\n"+
		"\b\3\t\3\t\3\t\3\t\7\t\u00fb\n\t\f\t\16\t\u00fe\13\t\3\t\3\t\5\t\u0102"+
		"\n\t\5\t\u0104\n\t\3\t\3\t\3\n\3\n\3\n\3\13\3\13\5\13\u010d\n\13\3\13"+
		"\3\13\5\13\u0111\n\13\3\f\3\f\3\f\3\r\3\r\3\r\5\r\u0119\n\r\3\16\3\16"+
		"\3\16\5\16\u011e\n\16\3\16\3\16\3\16\3\16\3\16\3\16\3\16\5\16\u0127\n"+
		"\16\3\16\3\16\5\16\u012b\n\16\3\17\3\17\3\17\3\17\3\17\3\17\5\17\u0133"+
		"\n\17\3\17\3\17\5\17\u0137\n\17\3\20\3\20\3\20\5\20\u013c\n\20\3\21\3"+
		"\21\3\21\3\22\3\22\3\22\3\22\7\22\u0145\n\22\f\22\16\22\u0148\13\22\3"+
		"\23\3\23\3\23\5\23\u014d\n\23\3\24\3\24\3\25\3\25\3\25\3\25\3\26\3\26"+
		"\3\26\3\26\3\26\3\26\3\26\5\26\u015c\n\26\3\27\3\27\3\27\3\27\3\27\3\27"+
		"\3\27\3\27\3\27\3\27\3\27\3\27\3\27\3\27\3\27\3\27\3\27\3\27\5\27\u0170"+
		"\n\27\3\27\3\27\5\27\u0174\n\27\3\27\3\27\5\27\u0178\n\27\3\27\3\27\3"+
		"\27\3\27\3\27\3\27\5\27\u0180\n\27\3\27\3\27\3\27\3\27\3\27\3\27\3\27"+
		"\5\27\u0189\n\27\3\27\3\27\3\27\5\27\u018e\n\27\3\27\3\27\3\27\3\27\3"+
		"\27\3\27\5\27\u0196\n\27\3\30\3\30\3\31\3\31\3\31\5\31\u019d\n\31\3\31"+
		"\3\31\3\32\3\32\3\32\5\32\u01a4\n\32\3\32\3\32\3\33\3\33\3\33\5\33\u01ab"+
		"\n\33\3\33\3\33\3\34\3\34\3\34\3\34\3\34\3\34\3\35\3\35\3\35\3\35\3\35"+
		"\3\35\3\36\3\36\5\36\u01bd\n\36\3\36\3\36\5\36\u01c1\n\36\5\36\u01c3\n"+
		"\36\3\36\3\36\3\37\6\37\u01c8\n\37\r\37\16\37\u01c9\3 \3 \3 \3 \5 \u01d0"+
		"\n \3!\3!\3!\5!\u01d5\n!\3\"\3\"\3\"\3\"\3#\3#\3#\3#\3#\3$\3$\3$\3$\5"+
		"$\u01e4\n$\3$\5$\u01e7\n$\3%\3%\3%\5%\u01ec\n%\3%\5%\u01ef\n%\3%\3%\3"+
		"&\3&\3&\3\'\3\'\3\'\3(\5(\u01fa\n(\3(\3(\5(\u01fe\n(\3(\3(\3(\5(\u0203"+
		"\n(\3(\3(\3(\3(\3(\3)\3)\3)\3)\3*\3*\5*\u0210\n*\3*\3*\7*\u0214\n*\f*"+
		"\16*\u0217\13*\3*\3*\3+\3+\3+\3+\7+\u021f\n+\f+\16+\u0222\13+\3+\3+\3"+
		"+\3+\3+\3+\5+\u022a\n+\3+\3+\5+\u022e\n+\3+\3+\3+\3+\5+\u0234\n+\3,\5"+
		",\u0237\n,\3,\5,\u023a\n,\3,\3,\3,\5,\u023f\n,\3,\3,\3,\3,\3,\3,\5,\u0247"+
		"\n,\3,\5,\u024a\n,\3,\3,\3,\3,\3,\3,\3,\3,\5,\u0254\n,\3,\5,\u0257\n,"+
		"\3,\3,\3,\5,\u025c\n,\3,\3,\3,\3,\3,\5,\u0263\n,\3-\3-\3-\7-\u0268\n-"+
		"\f-\16-\u026b\13-\3-\3-\5-\u026f\n-\3-\5-\u0272\n-\3.\3.\3.\5.\u0277\n"+
		".\3/\3/\3/\3\60\5\60\u027d\n\60\3\61\6\61\u0280\n\61\r\61\16\61\u0281"+
		"\3\62\3\62\3\62\3\62\3\63\7\63\u0289\n\63\f\63\16\63\u028c\13\63\3\63"+
		"\5\63\u028f\n\63\3\63\6\63\u0292\n\63\r\63\16\63\u0293\3\63\7\63\u0297"+
		"\n\63\f\63\16\63\u029a\13\63\3\63\7\63\u029d\n\63\f\63\16\63\u02a0\13"+
		"\63\3\64\5\64\u02a3\n\64\3\64\3\64\3\65\3\65\3\65\3\65\3\65\3\65\3\65"+
		"\3\65\3\65\3\65\3\65\5\65\u02b2\n\65\3\65\5\65\u02b5\n\65\3\65\3\65\3"+
		"\65\5\65\u02ba\n\65\3\65\3\65\3\65\3\65\3\65\3\65\3\65\3\65\3\65\3\65"+
		"\3\65\3\65\3\65\3\65\3\65\3\65\3\65\3\65\3\65\3\65\3\65\5\65\u02d1\n\65"+
		"\3\65\5\65\u02d4\n\65\3\66\3\66\3\66\3\66\3\66\3\66\3\66\5\66\u02dd\n"+
		"\66\3\67\3\67\3\67\3\67\7\67\u02e3\n\67\f\67\16\67\u02e6\13\67\3\67\5"+
		"\67\u02e9\n\67\5\67\u02eb\n\67\3\67\3\67\38\58\u02f0\n8\38\38\58\u02f4"+
		"\n8\39\39\39\79\u02f9\n9\f9\169\u02fc\139\3:\3:\3:\3:\5:\u0302\n:\3:\3"+
		":\3:\3:\3:\3:\3:\3:\3:\3:\3:\3:\3:\3:\5:\u0312\n:\3:\3:\3:\3:\3:\3:\3"+
		":\3:\3:\3:\3:\3:\3:\3:\3:\3:\3:\3:\3:\3:\3:\3:\3:\3:\3:\3:\3:\3:\3:\3"+
		":\3:\3:\5:\u0334\n:\3:\5:\u0337\n:\3:\3:\3:\3:\3:\3:\3:\3:\3:\3:\5:\u0343"+
		"\n:\3:\3:\3:\3:\3:\3:\3:\3:\3:\3:\3:\3:\3:\3:\3:\3:\3:\3:\3:\3:\3:\3:"+
		"\3:\3:\3:\3:\3:\3:\3:\3:\3:\3:\3:\3:\3:\3:\3:\3:\3:\3:\3:\3:\3:\3:\3:"+
		"\3:\3:\3:\3:\3:\3:\3:\3:\3:\3:\3:\3:\3:\3:\3:\3:\3:\5:\u0383\n:\3:\3:"+
		"\5:\u0387\n:\3:\3:\3:\3:\3:\3:\3:\3:\3:\3:\3:\7:\u0394\n:\f:\16:\u0397"+
		"\13:\3;\3;\3;\5;\u039c\n;\3<\3<\3<\3<\7<\u03a2\n<\f<\16<\u03a5\13<\5<"+
		"\u03a7\n<\3<\5<\u03aa\n<\3<\3<\3=\3=\5=\u03b0\n=\3=\3=\5=\u03b4\n=\3="+
		"\3=\5=\u03b8\n=\3=\3=\3=\3=\3=\3=\5=\u03c0\n=\3=\3=\3=\3=\5=\u03c6\n="+
		"\3>\3>\3>\5>\u03cb\n>\3>\5>\u03ce\n>\3?\3?\3?\3?\3?\5?\u03d5\n?\3@\3@"+
		"\3A\3A\3A\3A\3A\3A\3A\5A\u03e0\nA\3B\3B\3C\3C\3D\3D\3D\3D\3E\3E\3E\3E"+
		"\3F\3F\5F\u03f0\nF\3G\3G\3H\3H\3H\5H\u03f7\nH\3I\3I\3J\3J\3J\3J\5J\u03ff"+
		"\nJ\3K\3K\3L\3L\3L\3L\3L\5L\u0408\nL\3L\7L\u040b\nL\fL\16L\u040e\13L\3"+
		"M\3M\5M\u0412\nM\3M\3M\3M\3M\3M\5M\u0419\nM\3N\5N\u041c\nN\3N\3N\3N\5"+
		"N\u0421\nN\3N\5N\u0424\nN\3N\5N\u0427\nN\3N\5N\u042a\nN\3O\3O\3O\7O\u042f"+
		"\nO\fO\16O\u0432\13O\3P\3P\3P\3P\5P\u0438\nP\3P\3P\3P\3P\5P\u043e\nP\5"+
		"P\u0440\nP\3Q\3Q\3Q\3R\3R\3R\3S\3S\3S\7S\u044b\nS\fS\16S\u044e\13S\3T"+
		"\3T\3T\3T\3T\5T\u0455\nT\3U\3U\5U\u0459\nU\3U\7U\u045c\nU\fU\16U\u045f"+
		"\13U\3V\3V\3V\3V\3V\3V\3V\3V\3V\5V\u046a\nV\3W\3W\3W\3W\3W\3W\3W\3W\3"+
		"W\5W\u0475\nW\3X\3X\3X\3X\5X\u047b\nX\3Y\3Y\3Y\3Z\3Z\3Z\3[\3[\3[\3[\7"+
		"[\u0487\n[\f[\16[\u048a\13[\3\\\3\\\3\\\3\\\7\\\u0490\n\\\f\\\16\\\u0493"+
		"\13\\\5\\\u0495\n\\\3\\\5\\\u0498\n\\\3\\\3\\\3]\3]\3]\3]\3]\2\3r^\2\4"+
		"\6\b\n\f\16\20\22\24\26\30\32\34\36 \"$&(*,.\60\62\64\668:<>@BDFHJLNP"+
		"RTVXZ\\^`bdfhjlnprtvxz|~\u0080\u0082\u0084\u0086\u0088\u008a\u008c\u008e"+
		"\u0090\u0092\u0094\u0096\u0098\u009a\u009c\u009e\u00a0\u00a2\u00a4\u00a6"+
		"\u00a8\u00aa\u00ac\u00ae\u00b0\u00b2\u00b4\u00b6\u00b8\2\16\5\2OOddii"+
		"\3\2\32\34\3\2\26\27\3\2 \"\3\2#&\3\2\'*\3\2\60;\3\2?C\3\2DG\5\2llzz\u0082"+
		"\u0082\5\2Hmxx{\u0081\4\2\'\'))\2\u0525\2\u00bb\3\2\2\2\4\u00c2\3\2\2"+
		"\2\6\u00d8\3\2\2\2\b\u00da\3\2\2\2\n\u00e1\3\2\2\2\f\u00e5\3\2\2\2\16"+
		"\u00f4\3\2\2\2\20\u00f6\3\2\2\2\22\u0107\3\2\2\2\24\u010c\3\2\2\2\26\u0112"+
		"\3\2\2\2\30\u0115\3\2\2\2\32\u012a\3\2\2\2\34\u0136\3\2\2\2\36\u013b\3"+
		"\2\2\2 \u013d\3\2\2\2\"\u0140\3\2\2\2$\u0149\3\2\2\2&\u014e\3\2\2\2(\u0150"+
		"\3\2\2\2*\u0154\3\2\2\2,\u0195\3\2\2\2.\u0197\3\2\2\2\60\u0199\3\2\2\2"+
		"\62\u01a0\3\2\2\2\64\u01a7\3\2\2\2\66\u01ae\3\2\2\28\u01b4\3\2\2\2:\u01ba"+
		"\3\2\2\2<\u01c7\3\2\2\2>\u01cb\3\2\2\2@\u01d1\3\2\2\2B\u01d6\3\2\2\2D"+
		"\u01da\3\2\2\2F\u01df\3\2\2\2H\u01e8\3\2\2\2J\u01f2\3\2\2\2L\u01f5\3\2"+
		"\2\2N\u01f9\3\2\2\2P\u0209\3\2\2\2R\u020f\3\2\2\2T\u0233\3\2\2\2V\u0262"+
		"\3\2\2\2X\u0271\3\2\2\2Z\u0273\3\2\2\2\\\u0278\3\2\2\2^\u027c\3\2\2\2"+
		"`\u027f\3\2\2\2b\u0283\3\2\2\2d\u028a\3\2\2\2f\u02a2\3\2\2\2h\u02d3\3"+
		"\2\2\2j\u02dc\3\2\2\2l\u02de\3\2\2\2n\u02ef\3\2\2\2p\u02f5\3\2\2\2r\u0342"+
		"\3\2\2\2t\u039b\3\2\2\2v\u039d\3\2\2\2x\u03c5\3\2\2\2z\u03cd\3\2\2\2|"+
		"\u03d4\3\2\2\2~\u03d6\3\2\2\2\u0080\u03df\3\2\2\2\u0082\u03e1\3\2\2\2"+
		"\u0084\u03e3\3\2\2\2\u0086\u03e5\3\2\2\2\u0088\u03e9\3\2\2\2\u008a\u03ef"+
		"\3\2\2\2\u008c\u03f1\3\2\2\2\u008e\u03f6\3\2\2\2\u0090\u03f8\3\2\2\2\u0092"+
		"\u03fe\3\2\2\2\u0094\u0400\3\2\2\2\u0096\u0407\3\2\2\2\u0098\u040f\3\2"+
		"\2\2\u009a\u041b\3\2\2\2\u009c\u042b\3\2\2\2\u009e\u043f\3\2\2\2\u00a0"+
		"\u0441\3\2\2\2\u00a2\u0444\3\2\2\2\u00a4\u0447\3\2\2\2\u00a6\u0454\3\2"+
		"\2\2\u00a8\u0456\3\2\2\2\u00aa\u0469\3\2\2\2\u00ac\u0474\3\2\2\2\u00ae"+
		"\u047a\3\2\2\2\u00b0\u047c\3\2\2\2\u00b2\u047f\3\2\2\2\u00b4\u0482\3\2"+
		"\2\2\u00b6\u048b\3\2\2\2\u00b8\u049b\3\2\2\2\u00ba\u00bc\7\3\2\2\u00bb"+
		"\u00ba\3\2\2\2\u00bb\u00bc\3\2\2\2\u00bc\u00be\3\2\2\2\u00bd\u00bf\5`"+
		"\61\2\u00be\u00bd\3\2\2\2\u00be\u00bf\3\2\2\2\u00bf\u00c0\3\2\2\2\u00c0"+
		"\u00c1\7\2\2\3\u00c1\3\3\2\2\2\u00c2\u00c3\5\6\4\2\u00c3\5\3\2\2\2\u00c4"+
		"\u00d9\5\b\5\2\u00c5\u00d9\5\u0094K\2\u00c6\u00d9\5 \21\2\u00c7\u00d9"+
		"\5\f\7\2\u00c8\u00d9\5\32\16\2\u00c9\u00d9\5&\24\2\u00ca\u00d9\5P)\2\u00cb"+
		"\u00d9\5N(\2\u00cc\u00d9\5(\25\2\u00cd\u00d9\5*\26\2\u00ce\u00d9\5,\27"+
		"\2\u00cf\u00d9\5\60\31\2\u00d0\u00d9\5\62\32\2\u00d1\u00d9\5\64\33\2\u00d2"+
		"\u00d9\5\66\34\2\u00d3\u00d9\5B\"\2\u00d4\u00d9\58\35\2\u00d5\u00d9\5"+
		"D#\2\u00d6\u00d9\5F$\2\u00d7\u00d9\5L\'\2\u00d8\u00c4\3\2\2\2\u00d8\u00c5"+
		"\3\2\2\2\u00d8\u00c6\3\2\2\2\u00d8\u00c7\3\2\2\2\u00d8\u00c8\3\2\2\2\u00d8"+
		"\u00c9\3\2\2\2\u00d8\u00ca\3\2\2\2\u00d8\u00cb\3\2\2\2\u00d8\u00cc\3\2"+
		"\2\2\u00d8\u00cd\3\2\2\2\u00d8\u00ce\3\2\2\2\u00d8\u00cf\3\2\2\2\u00d8"+
		"\u00d0\3\2\2\2\u00d8\u00d1\3\2\2\2\u00d8\u00d2\3\2\2\2\u00d8\u00d3\3\2"+
		"\2\2\u00d8\u00d4\3\2\2\2\u00d8\u00d5\3\2\2\2\u00d8\u00d6\3\2\2\2\u00d8"+
		"\u00d7\3\2\2\2\u00d9\7\3\2\2\2\u00da\u00dc\7\13\2\2\u00db\u00dd\5\n\6"+
		"\2\u00dc\u00db\3\2\2\2\u00dc\u00dd\3\2\2\2\u00dd\u00de\3\2\2\2\u00de\u00df"+
		"\7\f\2\2\u00df\t\3\2\2\2\u00e0\u00e2\5\6\4\2\u00e1\u00e0\3\2\2\2\u00e2"+
		"\u00e3\3\2\2\2\u00e3\u00e1\3\2\2\2\u00e3\u00e4\3\2\2\2\u00e4\13\3\2\2"+
		"\2\u00e5\u00e6\7k\2\2\u00e6\u00e7\5\16\b\2\u00e7\r\3\2\2\2\u00e8\u00ea"+
		"\5\22\n\2\u00e9\u00e8\3\2\2\2\u00e9\u00ea\3\2\2\2\u00ea\u00ed\3\2\2\2"+
		"\u00eb\u00ee\5\24\13\2\u00ec\u00ee\5\20\t\2\u00ed\u00eb\3\2\2\2\u00ed"+
		"\u00ec\3\2\2\2\u00ee\u00ef\3\2\2\2\u00ef\u00f0\5\26\f\2\u00f0\u00f1\5"+
		"\u0092J\2\u00f1\u00f5\3\2\2\2\u00f2\u00f3\7\u0083\2\2\u00f3\u00f5\5\u0092"+
		"J\2\u00f4\u00e9\3\2\2\2\u00f4\u00f2\3\2\2\2\u00f5\17\3\2\2\2\u00f6\u00fc"+
		"\7\13\2\2\u00f7\u00f8\5\30\r\2\u00f8\u00f9\7\16\2\2\u00f9\u00fb\3\2\2"+
		"\2\u00fa\u00f7\3\2\2\2\u00fb\u00fe\3\2\2\2\u00fc\u00fa\3\2\2\2\u00fc\u00fd"+
		"\3\2\2\2\u00fd\u0103\3\2\2\2\u00fe\u00fc\3\2\2\2\u00ff\u0101\5\30\r\2"+
		"\u0100\u0102\7\16\2\2\u0101\u0100\3\2\2\2\u0101\u0102\3\2\2\2\u0102\u0104"+
		"\3\2\2\2\u0103\u00ff\3\2\2\2\u0103\u0104\3\2\2\2\u0104\u0105\3\2\2\2\u0105"+
		"\u0106\7\f\2\2\u0106\21\3\2\2\2\u0107\u0108\5\30\r\2\u0108\u0109\7\16"+
		"\2\2\u0109\23\3\2\2\2\u010a\u010d\7\32\2\2\u010b\u010d\5\u008aF\2\u010c"+
		"\u010a\3\2\2\2\u010c\u010b\3\2\2\2\u010d\u0110\3\2\2\2\u010e\u010f\7b"+
		"\2\2\u010f\u0111\5\u008aF\2\u0110\u010e\3\2\2\2\u0110\u0111\3\2\2\2\u0111"+
		"\25\3\2\2\2\u0112\u0113\7c\2\2\u0113\u0114\7\u0083\2\2\u0114\27\3\2\2"+
		"\2\u0115\u0118\5\u008aF\2\u0116\u0117\7b\2\2\u0117\u0119\5\u008aF\2\u0118"+
		"\u0116\3\2\2\2\u0118\u0119\3\2\2\2\u0119\31\3\2\2\2\u011a\u011d\7j\2\2"+
		"\u011b\u011e\5\34\17\2\u011c\u011e\5\36\20\2\u011d\u011b\3\2\2\2\u011d"+
		"\u011c\3\2\2\2\u011e\u011f\3\2\2\2\u011f\u0120\5\u0092J\2\u0120\u012b"+
		"\3\2\2\2\u0121\u0122\7j\2\2\u0122\u0126\7\\\2\2\u0123\u0127\5P)\2\u0124"+
		"\u0127\5N(\2\u0125\u0127\5r:\2\u0126\u0123\3\2\2\2\u0126\u0124\3\2\2\2"+
		"\u0126\u0125\3\2\2\2\u0127\u0128\3\2\2\2\u0128\u0129\5\u0092J\2\u0129"+
		"\u012b\3\2\2\2\u012a\u011a\3\2\2\2\u012a\u0121\3\2\2\2\u012b\33\3\2\2"+
		"\2\u012c\u012d\5\24\13\2\u012d\u012e\5\26\f\2\u012e\u012f\5\u0092J\2\u012f"+
		"\u0137\3\2\2\2\u0130\u0132\5\20\t\2\u0131\u0133\5\26\f\2\u0132\u0131\3"+
		"\2\2\2\u0132\u0133\3\2\2\2\u0133\u0134\3\2\2\2\u0134\u0135\5\u0092J\2"+
		"\u0135\u0137\3\2\2\2\u0136\u012c\3\2\2\2\u0136\u0130\3\2\2\2\u0137\35"+
		"\3\2\2\2\u0138\u013c\5 \21\2\u0139\u013c\5P)\2\u013a\u013c\5N(\2\u013b"+
		"\u0138\3\2\2\2\u013b\u0139\3\2\2\2\u013b\u013a\3\2\2\2\u013c\37\3\2\2"+
		"\2\u013d\u013e\5\"\22\2\u013e\u013f\5\u0092J\2\u013f!\3\2\2\2\u0140\u0141"+
		"\5.\30\2\u0141\u0146\5$\23\2\u0142\u0143\7\16\2\2\u0143\u0145\5$\23\2"+
		"\u0144\u0142\3\2\2\2\u0145\u0148\3\2\2\2\u0146\u0144\3\2\2\2\u0146\u0147"+
		"\3\2\2\2\u0147#\3\2\2\2\u0148\u0146\3\2\2\2\u0149\u014c\5t;\2\u014a\u014b"+
		"\7\17\2\2\u014b\u014d\5r:\2\u014c\u014a\3\2\2\2\u014c\u014d\3\2\2\2\u014d"+
		"%\3\2\2\2\u014e\u014f\7\r\2\2\u014f\'\3\2\2\2\u0150\u0151\6\25\2\2\u0151"+
		"\u0152\5p9\2\u0152\u0153\5\u0092J\2\u0153)\3\2\2\2\u0154\u0155\7]\2\2"+
		"\u0155\u0156\7\t\2\2\u0156\u0157\5p9\2\u0157\u0158\7\n\2\2\u0158\u015b"+
		"\5\6\4\2\u0159\u015a\7M\2\2\u015a\u015c\5\6\4\2\u015b\u0159\3\2\2\2\u015b"+
		"\u015c\3\2\2\2\u015c+\3\2\2\2\u015d\u015e\7I\2\2\u015e\u015f\5\6\4\2\u015f"+
		"\u0160\7W\2\2\u0160\u0161\7\t\2\2\u0161\u0162\5p9\2\u0162\u0163\7\n\2"+
		"\2\u0163\u0164\5\u0092J\2\u0164\u0196\3\2\2\2\u0165\u0166\7W\2\2\u0166"+
		"\u0167\7\t\2\2\u0167\u0168\5p9\2\u0168\u0169\7\n\2\2\u0169\u016a\5\6\4"+
		"\2\u016a\u0196\3\2\2\2\u016b\u016c\7U\2\2\u016c\u016f\7\t\2\2\u016d\u0170"+
		"\5p9\2\u016e\u0170\5\"\22\2\u016f\u016d\3\2\2\2\u016f\u016e\3\2\2\2\u016f"+
		"\u0170\3\2\2\2\u0170\u0171\3\2\2\2\u0171\u0173\7\r\2\2\u0172\u0174\5p"+
		"9\2\u0173\u0172\3\2\2\2\u0173\u0174\3\2\2\2\u0174\u0175\3\2\2\2\u0175"+
		"\u0177\7\r\2\2\u0176\u0178\5p9\2\u0177\u0176\3\2\2\2\u0177\u0178\3\2\2"+
		"\2\u0178\u0179\3\2\2\2\u0179\u017a\7\n\2\2\u017a\u0196\5\6\4\2\u017b\u017c"+
		"\7U\2\2\u017c\u017f\7\t\2\2\u017d\u0180\5r:\2\u017e\u0180\5\"\22\2\u017f"+
		"\u017d\3\2\2\2\u017f\u017e\3\2\2\2\u0180\u0181\3\2\2\2\u0181\u0182\7`"+
		"\2\2\u0182\u0183\5p9\2\u0183\u0184\7\n\2\2\u0184\u0185\5\6\4\2\u0185\u0196"+
		"\3\2\2\2\u0186\u0188\7U\2\2\u0187\u0189\7m\2\2\u0188\u0187\3\2\2\2\u0188"+
		"\u0189\3\2\2\2\u0189\u018a\3\2\2\2\u018a\u018d\7\t\2\2\u018b\u018e\5r"+
		":\2\u018c\u018e\5\"\22\2\u018d\u018b\3\2\2\2\u018d\u018c\3\2\2\2\u018e"+
		"\u018f\3\2\2\2\u018f\u0190\5\u008cG\2\u0190\u0191\6\27\3\2\u0191\u0192"+
		"\5p9\2\u0192\u0193\7\n\2\2\u0193\u0194\5\6\4\2\u0194\u0196\3\2\2\2\u0195"+
		"\u015d\3\2\2\2\u0195\u0165\3\2\2\2\u0195\u016b\3\2\2\2\u0195\u017b\3\2"+
		"\2\2\u0195\u0186\3\2\2\2\u0196-\3\2\2\2\u0197\u0198\t\2\2\2\u0198/\3\2"+
		"\2\2\u0199\u019c\7T\2\2\u019a\u019b\6\31\4\2\u019b\u019d\5\u008cG\2\u019c"+
		"\u019a\3\2\2\2\u019c\u019d\3\2\2\2\u019d\u019e\3\2\2\2\u019e\u019f\5\u0092"+
		"J\2\u019f\61\3\2\2\2\u01a0\u01a3\7H\2\2\u01a1\u01a2\6\32\5\2\u01a2\u01a4"+
		"\5\u008cG\2\u01a3\u01a1\3\2\2\2\u01a3\u01a4\3\2\2\2\u01a4\u01a5\3\2\2"+
		"\2\u01a5\u01a6\5\u0092J\2\u01a6\63\3\2\2\2\u01a7\u01aa\7R\2\2\u01a8\u01a9"+
		"\6\33\6\2\u01a9\u01ab\5p9\2\u01aa\u01a8\3\2\2\2\u01aa\u01ab\3\2\2\2\u01ab"+
		"\u01ac\3\2\2\2\u01ac\u01ad\5\u0092J\2\u01ad\65\3\2\2\2\u01ae\u01af\7["+
		"\2\2\u01af\u01b0\7\t\2\2\u01b0\u01b1\5p9\2\u01b1\u01b2\7\n\2\2\u01b2\u01b3"+
		"\5\6\4\2\u01b3\67\3\2\2\2\u01b4\u01b5\7V\2\2\u01b5\u01b6\7\t\2\2\u01b6"+
		"\u01b7\5p9\2\u01b7\u01b8\7\n\2\2\u01b8\u01b9\5:\36\2\u01b99\3\2\2\2\u01ba"+
		"\u01bc\7\13\2\2\u01bb\u01bd\5<\37\2\u01bc\u01bb\3\2\2\2\u01bc\u01bd\3"+
		"\2\2\2\u01bd\u01c2\3\2\2\2\u01be\u01c0\5@!\2\u01bf\u01c1\5<\37\2\u01c0"+
		"\u01bf\3\2\2\2\u01c0\u01c1\3\2\2\2\u01c1\u01c3\3\2\2\2\u01c2\u01be\3\2"+
		"\2\2\u01c2\u01c3\3\2\2\2\u01c3\u01c4\3\2\2\2\u01c4\u01c5\7\f\2\2\u01c5"+
		";\3\2\2\2\u01c6\u01c8\5> \2\u01c7\u01c6\3\2\2\2\u01c8\u01c9\3\2\2\2\u01c9"+
		"\u01c7\3\2\2\2\u01c9\u01ca\3\2\2\2\u01ca=\3\2\2\2\u01cb\u01cc\7L\2\2\u01cc"+
		"\u01cd\5p9\2\u01cd\u01cf\7\21\2\2\u01ce\u01d0\5\n\6\2\u01cf\u01ce\3\2"+
		"\2\2\u01cf\u01d0\3\2\2\2\u01d0?\3\2\2\2\u01d1\u01d2\7\\\2\2\u01d2\u01d4"+
		"\7\21\2\2\u01d3\u01d5\5\n\6\2\u01d4\u01d3\3\2\2\2\u01d4\u01d5\3\2\2\2"+
		"\u01d5A\3\2\2\2\u01d6\u01d7\5\u008cG\2\u01d7\u01d8\7\21\2\2\u01d8\u01d9"+
		"\5\6\4\2\u01d9C\3\2\2\2\u01da\u01db\7^\2\2\u01db\u01dc\6#\7\2\u01dc\u01dd"+
		"\5p9\2\u01dd\u01de\5\u0092J\2\u01deE\3\2\2\2\u01df\u01e0\7a\2\2\u01e0"+
		"\u01e6\5\b\5\2\u01e1\u01e3\5H%\2\u01e2\u01e4\5J&\2\u01e3\u01e2\3\2\2\2"+
		"\u01e3\u01e4\3\2\2\2\u01e4\u01e7\3\2\2\2\u01e5\u01e7\5J&\2\u01e6\u01e1"+
		"\3\2\2\2\u01e6\u01e5\3\2\2\2\u01e7G\3\2\2\2\u01e8\u01ee\7P\2\2\u01e9\u01eb"+
		"\7\t\2\2\u01ea\u01ec\5t;\2\u01eb\u01ea\3\2\2\2\u01eb\u01ec\3\2\2\2\u01ec"+
		"\u01ed\3\2\2\2\u01ed\u01ef\7\n\2\2\u01ee\u01e9\3\2\2\2\u01ee\u01ef\3\2"+
		"\2\2\u01ef\u01f0\3\2\2\2\u01f0\u01f1\5\b\5\2\u01f1I\3\2\2\2\u01f2\u01f3"+
		"\7Q\2\2\u01f3\u01f4\5\b\5\2\u01f4K\3\2\2\2\u01f5\u01f6\7X\2\2\u01f6\u01f7"+
		"\5\u0092J\2\u01f7M\3\2\2\2\u01f8\u01fa\7l\2\2\u01f9\u01f8\3\2\2\2\u01f9"+
		"\u01fa\3\2\2\2\u01fa\u01fb\3\2\2\2\u01fb\u01fd\7Y\2\2\u01fc\u01fe\7\32"+
		"\2\2\u01fd\u01fc\3\2\2\2\u01fd\u01fe\3\2\2\2\u01fe\u01ff\3\2\2\2\u01ff"+
		"\u0200\5\u008cG\2\u0200\u0202\7\t\2\2\u0201\u0203\5X-\2\u0202\u0201\3"+
		"\2\2\2\u0202\u0203\3\2\2\2\u0203\u0204\3\2\2\2\u0204\u0205\7\n\2\2\u0205"+
		"\u0206\7\13\2\2\u0206\u0207\5^\60\2\u0207\u0208\7\f\2\2\u0208O\3\2\2\2"+
		"\u0209\u020a\7e\2\2\u020a\u020b\5\u008cG\2\u020b\u020c\5R*\2\u020cQ\3"+
		"\2\2\2\u020d\u020e\7g\2\2\u020e\u0210\5r:\2\u020f\u020d\3\2\2\2\u020f"+
		"\u0210\3\2\2\2\u0210\u0211\3\2\2\2\u0211\u0215\7\13\2\2\u0212\u0214\5"+
		"T+\2\u0213\u0212\3\2\2\2\u0214\u0217\3\2\2\2\u0215\u0213\3\2\2\2\u0215"+
		"\u0216\3\2\2\2\u0216\u0218\3\2\2\2\u0217\u0215\3\2\2\2\u0218\u0219\7\f"+
		"\2\2\u0219S\3\2\2\2\u021a\u021f\7\u0080\2\2\u021b\u021c\6+\b\2\u021c\u021f"+
		"\5\u008cG\2\u021d\u021f\7l\2\2\u021e\u021a\3\2\2\2\u021e\u021b\3\2\2\2"+
		"\u021e\u021d\3\2\2\2\u021f\u0222\3\2\2\2\u0220\u021e\3\2\2\2\u0220\u0221"+
		"\3\2\2\2\u0221\u0229\3\2\2\2\u0222\u0220\3\2\2\2\u0223\u022a\5V,\2\u0224"+
		"\u0225\5t;\2\u0225\u0226\7\17\2\2\u0226\u0227\5v<\2\u0227\u0228\7\r\2"+
		"\2\u0228\u022a\3\2\2\2\u0229\u0223\3\2\2\2\u0229\u0224\3\2\2\2\u022a\u0234"+
		"\3\2\2\2\u022b\u0234\5&\24\2\u022c\u022e\7\37\2\2\u022d\u022c\3\2\2\2"+
		"\u022d\u022e\3\2\2\2\u022e\u022f\3\2\2\2\u022f\u0230\5j\66\2\u0230\u0231"+
		"\7\17\2\2\u0231\u0232\5r:\2\u0232\u0234\3\2\2\2\u0233\u0220\3\2\2\2\u0233"+
		"\u022b\3\2\2\2\u0233\u022d\3\2\2\2\u0234U\3\2\2\2\u0235\u0237\7\32\2\2"+
		"\u0236\u0235\3\2\2\2\u0236\u0237\3\2\2\2\u0237\u0239\3\2\2\2\u0238\u023a"+
		"\7\37\2\2\u0239\u0238\3\2\2\2\u0239\u023a\3\2\2\2\u023a\u023b\3\2\2\2"+
		"\u023b\u023c\5j\66\2\u023c\u023e\7\t\2\2\u023d\u023f\5X-\2\u023e\u023d"+
		"\3\2\2\2\u023e\u023f\3\2\2\2\u023f\u0240\3\2\2\2\u0240\u0241\7\n\2\2\u0241"+
		"\u0242\7\13\2\2\u0242\u0243\5^\60\2\u0243\u0244\7\f\2\2\u0244\u0263\3"+
		"\2\2\2\u0245\u0247\7\32\2\2\u0246\u0245\3\2\2\2\u0246\u0247\3\2\2\2\u0247"+
		"\u0249\3\2\2\2\u0248\u024a\7\37\2\2\u0249\u0248\3\2\2\2\u0249\u024a\3"+
		"\2\2\2\u024a\u024b\3\2\2\2\u024b\u024c\5\u0086D\2\u024c\u024d\7\t\2\2"+
		"\u024d\u024e\7\n\2\2\u024e\u024f\7\13\2\2\u024f\u0250\5^\60\2\u0250\u0251"+
		"\7\f\2\2\u0251\u0263\3\2\2\2\u0252\u0254\7\32\2\2\u0253\u0252\3\2\2\2"+
		"\u0253\u0254\3\2\2\2\u0254\u0256\3\2\2\2\u0255\u0257\7\37\2\2\u0256\u0255"+
		"\3\2\2\2\u0256\u0257\3\2\2\2\u0257\u0258\3\2\2\2\u0258\u0259\5\u0088E"+
		"\2\u0259\u025b\7\t\2\2\u025a\u025c\5X-\2\u025b\u025a\3\2\2\2\u025b\u025c"+
		"\3\2\2\2\u025c\u025d\3\2\2\2\u025d\u025e\7\n\2\2\u025e\u025f\7\13\2\2"+
		"\u025f\u0260\5^\60\2\u0260\u0261\7\f\2\2\u0261\u0263\3\2\2\2\u0262\u0236"+
		"\3\2\2\2\u0262\u0246\3\2\2\2\u0262\u0253\3\2\2\2\u0263W\3\2\2\2\u0264"+
		"\u0269\5Z.\2\u0265\u0266\7\16\2\2\u0266\u0268\5Z.\2\u0267\u0265\3\2\2"+
		"\2\u0268\u026b\3\2\2\2\u0269\u0267\3\2\2\2\u0269\u026a\3\2\2\2\u026a\u026e"+
		"\3\2\2\2\u026b\u0269\3\2\2\2\u026c\u026d\7\16\2\2\u026d\u026f\5\\/\2\u026e"+
		"\u026c\3\2\2\2\u026e\u026f\3\2\2\2\u026f\u0272\3\2\2\2\u0270\u0272\5\\"+
		"/\2\u0271\u0264\3\2\2\2\u0271\u0270\3\2\2\2\u0272Y\3\2\2\2\u0273\u0276"+
		"\5t;\2\u0274\u0275\7\17\2\2\u0275\u0277\5r:\2\u0276\u0274\3\2\2\2\u0276"+
		"\u0277\3\2\2\2\u0277[\3\2\2\2\u0278\u0279\7\22\2\2\u0279\u027a\5r:\2\u027a"+
		"]\3\2\2\2\u027b\u027d\5`\61\2\u027c\u027b\3\2\2\2\u027c\u027d\3\2\2\2"+
		"\u027d_\3\2\2\2\u027e\u0280\5\4\3\2\u027f\u027e\3\2\2\2\u0280\u0281\3"+
		"\2\2\2\u0281\u027f\3\2\2\2\u0281\u0282\3\2\2\2\u0282a\3\2\2\2\u0283\u0284"+
		"\7\7\2\2\u0284\u0285\5d\63\2\u0285\u0286\7\b\2\2\u0286c\3\2\2\2\u0287"+
		"\u0289\7\16\2\2\u0288\u0287\3\2\2\2\u0289\u028c\3\2\2\2\u028a\u0288\3"+
		"\2\2\2\u028a\u028b\3\2\2\2\u028b\u028e\3\2\2\2\u028c\u028a\3\2\2\2\u028d"+
		"\u028f\5f\64\2\u028e\u028d\3\2\2\2\u028e\u028f\3\2\2\2\u028f\u0298\3\2"+
		"\2\2\u0290\u0292\7\16\2\2\u0291\u0290\3\2\2\2\u0292\u0293\3\2\2\2\u0293"+
		"\u0291\3\2\2\2\u0293\u0294\3\2\2\2\u0294\u0295\3\2\2\2\u0295\u0297\5f"+
		"\64\2\u0296\u0291\3\2\2\2\u0297\u029a\3\2\2\2\u0298\u0296\3\2\2\2\u0298"+
		"\u0299\3\2\2\2\u0299\u029e\3\2\2\2\u029a\u0298\3\2\2\2\u029b\u029d\7\16"+
		"\2\2\u029c\u029b\3\2\2\2\u029d\u02a0\3\2\2\2\u029e\u029c\3\2\2\2\u029e"+
		"\u029f\3\2\2\2\u029fe\3\2\2\2\u02a0\u029e\3\2\2\2\u02a1\u02a3\7\22\2\2"+
		"\u02a2\u02a1\3\2\2\2\u02a2\u02a3\3\2\2\2\u02a3\u02a4\3\2\2\2\u02a4\u02a5"+
		"\5r:\2\u02a5g\3\2\2\2\u02a6\u02a7\5j\66\2\u02a7\u02a8\7\21\2\2\u02a8\u02a9"+
		"\5r:\2\u02a9\u02d4\3\2\2\2\u02aa\u02ab\7\7\2\2\u02ab\u02ac\5r:\2\u02ac"+
		"\u02ad\7\b\2\2\u02ad\u02ae\7\21\2\2\u02ae\u02af\5r:\2\u02af\u02d4\3\2"+
		"\2\2\u02b0\u02b2\7l\2\2\u02b1\u02b0\3\2\2\2\u02b1\u02b2\3\2\2\2\u02b2"+
		"\u02b4\3\2\2\2\u02b3\u02b5\7\32\2\2\u02b4\u02b3\3\2\2\2\u02b4\u02b5\3"+
		"\2\2\2\u02b5\u02b6\3\2\2\2\u02b6\u02b7\5j\66\2\u02b7\u02b9\7\t\2\2\u02b8"+
		"\u02ba\5X-\2\u02b9\u02b8\3\2\2\2\u02b9\u02ba\3\2\2\2\u02ba\u02bb\3\2\2"+
		"\2\u02bb\u02bc\7\n\2\2\u02bc\u02bd\7\13\2\2\u02bd\u02be\5^\60\2\u02be"+
		"\u02bf\7\f\2\2\u02bf\u02d4\3\2\2\2\u02c0\u02c1\5\u0086D\2\u02c1\u02c2"+
		"\7\t\2\2\u02c2\u02c3\7\n\2\2\u02c3\u02c4\7\13\2\2\u02c4\u02c5\5^\60\2"+
		"\u02c5\u02c6\7\f\2\2\u02c6\u02d4\3\2\2\2\u02c7\u02c8\5\u0088E\2\u02c8"+
		"\u02c9\7\t\2\2\u02c9\u02ca\5Z.\2\u02ca\u02cb\7\n\2\2\u02cb\u02cc\7\13"+
		"\2\2\u02cc\u02cd\5^\60\2\u02cd\u02ce\7\f\2\2\u02ce\u02d4\3\2\2\2\u02cf"+
		"\u02d1\7\22\2\2\u02d0\u02cf\3\2\2\2\u02d0\u02d1\3\2\2\2\u02d1\u02d2\3"+
		"\2\2\2\u02d2\u02d4\5r:\2\u02d3\u02a6\3\2\2\2\u02d3\u02aa\3\2\2\2\u02d3"+
		"\u02b1\3\2\2\2\u02d3\u02c0\3\2\2\2\u02d3\u02c7\3\2\2\2\u02d3\u02d0\3\2"+
		"\2\2\u02d4i\3\2\2\2\u02d5\u02dd\5\u008aF\2\u02d6\u02dd\7\u0083\2\2\u02d7"+
		"\u02dd\5\u0082B\2\u02d8\u02d9\7\7\2\2\u02d9\u02da\5r:\2\u02da\u02db\7"+
		"\b\2\2\u02db\u02dd\3\2\2\2\u02dc\u02d5\3\2\2\2\u02dc\u02d6\3\2\2\2\u02dc"+
		"\u02d7\3\2\2\2\u02dc\u02d8\3\2\2\2\u02ddk\3\2\2\2\u02de\u02ea\7\t\2\2"+
		"\u02df\u02e4\5n8\2\u02e0\u02e1\7\16\2\2\u02e1\u02e3\5n8\2\u02e2\u02e0"+
		"\3\2\2\2\u02e3\u02e6\3\2\2\2\u02e4\u02e2\3\2\2\2\u02e4\u02e5\3\2\2\2\u02e5"+
		"\u02e8\3\2\2\2\u02e6\u02e4\3\2\2\2\u02e7\u02e9\7\16\2\2\u02e8\u02e7\3"+
		"\2\2\2\u02e8\u02e9\3\2\2\2\u02e9\u02eb\3\2\2\2\u02ea\u02df\3\2\2\2\u02ea"+
		"\u02eb\3\2\2\2\u02eb\u02ec\3\2\2\2\u02ec\u02ed\7\n\2\2\u02edm\3\2\2\2"+
		"\u02ee\u02f0\7\22\2\2\u02ef\u02ee\3\2\2\2\u02ef\u02f0\3\2\2\2\u02f0\u02f3"+
		"\3\2\2\2\u02f1\u02f4\5r:\2\u02f2\u02f4\5\u008cG\2\u02f3\u02f1\3\2\2\2"+
		"\u02f3\u02f2\3\2\2\2\u02f4o\3\2\2\2\u02f5\u02fa\5r:\2\u02f6\u02f7\7\16"+
		"\2\2\u02f7\u02f9\5r:\2\u02f8\u02f6\3\2\2\2\u02f9\u02fc\3\2\2\2\u02fa\u02f8"+
		"\3\2\2\2\u02fa\u02fb\3\2\2\2\u02fbq\3\2\2\2\u02fc\u02fa\3\2\2\2\u02fd"+
		"\u02fe\b:\1\2\u02fe\u0343\5x=\2\u02ff\u0301\7e\2\2\u0300\u0302\5\u008c"+
		"G\2\u0301\u0300\3\2\2\2\u0301\u0302\3\2\2\2\u0302\u0303\3\2\2\2\u0303"+
		"\u0343\5R*\2\u0304\u0305\7N\2\2\u0305\u0306\5r:\2\u0306\u0307\7\23\2\2"+
		"\u0307\u0308\5\u008aF\2\u0308\u0309\5l\67\2\u0309\u0343\3\2\2\2\u030a"+
		"\u030b\7N\2\2\u030b\u030c\5r:\2\u030c\u030d\5l\67\2\u030d\u0343\3\2\2"+
		"\2\u030e\u030f\7N\2\2\u030f\u0311\5r:\2\u0310\u0312\5l\67\2\u0311\u0310"+
		"\3\2\2\2\u0311\u0312\3\2\2\2\u0312\u0343\3\2\2\2\u0313\u0314\7N\2\2\u0314"+
		"\u0315\7\23\2\2\u0315\u0343\5\u008cG\2\u0316\u0317\7_\2\2\u0317\u0343"+
		"\5r:(\u0318\u0319\7S\2\2\u0319\u0343\5r:\'\u031a\u031b\7K\2\2\u031b\u0343"+
		"\5r:&\u031c\u031d\7\24\2\2\u031d\u0343\5r:%\u031e\u031f\7\25\2\2\u031f"+
		"\u0343\5r:$\u0320\u0321\7\26\2\2\u0321\u0343\5r:#\u0322\u0323\7\27\2\2"+
		"\u0323\u0343\5r:\"\u0324\u0325\7\30\2\2\u0325\u0343\5r:!\u0326\u0327\7"+
		"\31\2\2\u0327\u0343\5r: \u0328\u0329\7m\2\2\u0329\u0343\5r:\37\u032a\u032b"+
		"\7k\2\2\u032b\u032c\7\t\2\2\u032c\u032d\5r:\2\u032d\u032e\7\n\2\2\u032e"+
		"\u0343\3\2\2\2\u032f\u0343\7Z\2\2\u0330\u0336\7\u0081\2\2\u0331\u0333"+
		"\6:\t\2\u0332\u0334\7\32\2\2\u0333\u0332\3\2\2\2\u0333\u0334\3\2\2\2\u0334"+
		"\u0335\3\2\2\2\u0335\u0337\5p9\2\u0336\u0331\3\2\2\2\u0336\u0337\3\2\2"+
		"\2\u0337\u0343\3\2\2\2\u0338\u0343\5\u008cG\2\u0339\u0343\7h\2\2\u033a"+
		"\u0343\5\u0080A\2\u033b\u0343\5b\62\2\u033c\u0343\5v<\2\u033d\u033e\7"+
		"\t\2\2\u033e\u033f\5p9\2\u033f\u0340\7\n\2\2\u0340\u0343\3\2\2\2\u0341"+
		"\u0343\5\u0096L\2\u0342\u02fd\3\2\2\2\u0342\u02ff\3\2\2\2\u0342\u0304"+
		"\3\2\2\2\u0342\u030a\3\2\2\2\u0342\u030e\3\2\2\2\u0342\u0313\3\2\2\2\u0342"+
		"\u0316\3\2\2\2\u0342\u0318\3\2\2\2\u0342\u031a\3\2\2\2\u0342\u031c\3\2"+
		"\2\2\u0342\u031e\3\2\2\2\u0342\u0320\3\2\2\2\u0342\u0322\3\2\2\2\u0342"+
		"\u0324\3\2\2\2\u0342\u0326\3\2\2\2\u0342\u0328\3\2\2\2\u0342\u032a\3\2"+
		"\2\2\u0342\u032f\3\2\2\2\u0342\u0330\3\2\2\2\u0342\u0338\3\2\2\2\u0342"+
		"\u0339\3\2\2\2\u0342\u033a\3\2\2\2\u0342\u033b\3\2\2\2\u0342\u033c\3\2"+
		"\2\2\u0342\u033d\3\2\2\2\u0342\u0341\3\2\2\2\u0343\u0395\3\2\2\2\u0344"+
		"\u0345\f\36\2\2\u0345\u0346\7\35\2\2\u0346\u0394\5r:\36\u0347\u0348\f"+
		"\35\2\2\u0348\u0349\t\3\2\2\u0349\u0394\5r:\36\u034a\u034b\f\34\2\2\u034b"+
		"\u034c\t\4\2\2\u034c\u0394\5r:\35\u034d\u034e\f\33\2\2\u034e\u034f\7\36"+
		"\2\2\u034f\u0394\5r:\34\u0350\u0351\f\32\2\2\u0351\u0352\t\5\2\2\u0352"+
		"\u0394\5r:\33\u0353\u0354\f\31\2\2\u0354\u0355\t\6\2\2\u0355\u0394\5r"+
		":\32\u0356\u0357\f\30\2\2\u0357\u0358\7J\2\2\u0358\u0394\5r:\31\u0359"+
		"\u035a\f\27\2\2\u035a\u035b\7`\2\2\u035b\u0394\5r:\30\u035c\u035d\f\26"+
		"\2\2\u035d\u035e\t\7\2\2\u035e\u0394\5r:\27\u035f\u0360\f\25\2\2\u0360"+
		"\u0361\7+\2\2\u0361\u0394\5r:\26\u0362\u0363\f\24\2\2\u0363\u0364\7,\2"+
		"\2\u0364\u0394\5r:\25\u0365\u0366\f\23\2\2\u0366\u0367\7-\2\2\u0367\u0394"+
		"\5r:\24\u0368\u0369\f\22\2\2\u0369\u036a\7.\2\2\u036a\u0394\5r:\23\u036b"+
		"\u036c\f\21\2\2\u036c\u036d\7/\2\2\u036d\u0394\5r:\22\u036e\u036f\f\20"+
		"\2\2\u036f\u0370\7\20\2\2\u0370\u0371\5r:\2\u0371\u0372\7\21\2\2\u0372"+
		"\u0373\5r:\21\u0373\u0394\3\2\2\2\u0374\u0375\f\17\2\2\u0375\u0376\7\17"+
		"\2\2\u0376\u0394\5r:\17\u0377\u0378\f\16\2\2\u0378\u0379\5~@\2\u0379\u037a"+
		"\5r:\16\u037a\u0394\3\2\2\2\u037b\u037c\f\61\2\2\u037c\u037d\7\7\2\2\u037d"+
		"\u037e\5p9\2\u037e\u037f\7\b\2\2\u037f\u0394\3\2\2\2\u0380\u0382\f/\2"+
		"\2\u0381\u0383\7\20\2\2\u0382\u0381\3\2\2\2\u0382\u0383\3\2\2\2\u0383"+
		"\u0384\3\2\2\2\u0384\u0386\7\23\2\2\u0385\u0387\7\37\2\2\u0386\u0385\3"+
		"\2\2\2\u0386\u0387\3\2\2\2\u0387\u0388\3\2\2\2\u0388\u0394\5\u008aF\2"+
		"\u0389\u038a\f+\2\2\u038a\u0394\5l\67\2\u038b\u038c\f*\2\2\u038c\u038d"+
		"\6:\37\2\u038d\u0394\7\24\2\2\u038e\u038f\f)\2\2\u038f\u0390\6:!\2\u0390"+
		"\u0394\7\25\2\2\u0391\u0392\f\f\2\2\u0392\u0394\7\u0084\2\2\u0393\u0344"+
		"\3\2\2\2\u0393\u0347\3\2\2\2\u0393\u034a\3\2\2\2\u0393\u034d\3\2\2\2\u0393"+
		"\u0350\3\2\2\2\u0393\u0353\3\2\2\2\u0393\u0356\3\2\2\2\u0393\u0359\3\2"+
		"\2\2\u0393\u035c\3\2\2\2\u0393\u035f\3\2\2\2\u0393\u0362\3\2\2\2\u0393"+
		"\u0365\3\2\2\2\u0393\u0368\3\2\2\2\u0393\u036b\3\2\2\2\u0393\u036e\3\2"+
		"\2\2\u0393\u0374\3\2\2\2\u0393\u0377\3\2\2\2\u0393\u037b\3\2\2\2\u0393"+
		"\u0380\3\2\2\2\u0393\u0389\3\2\2\2\u0393\u038b\3\2\2\2\u0393\u038e\3\2"+
		"\2\2\u0393\u0391\3\2\2\2\u0394\u0397\3\2\2\2\u0395\u0393\3\2\2\2\u0395"+
		"\u0396\3\2\2\2\u0396s\3\2\2\2\u0397\u0395\3\2\2\2\u0398\u039c\5\u008c"+
		"G\2\u0399\u039c\5b\62\2\u039a\u039c\5v<\2\u039b\u0398\3\2\2\2\u039b\u0399"+
		"\3\2\2\2\u039b\u039a\3\2\2\2\u039cu\3\2\2\2\u039d\u03a6\7\13\2\2\u039e"+
		"\u03a3\5h\65\2\u039f\u03a0\7\16\2\2\u03a0\u03a2\5h\65\2\u03a1\u039f\3"+
		"\2\2\2\u03a2\u03a5\3\2\2\2\u03a3\u03a1\3\2\2\2\u03a3\u03a4\3\2\2\2\u03a4"+
		"\u03a7\3\2\2\2\u03a5\u03a3\3\2\2\2\u03a6\u039e\3\2\2\2\u03a6\u03a7\3\2"+
		"\2\2\u03a7\u03a9\3\2\2\2\u03a8\u03aa\7\16\2\2\u03a9\u03a8\3\2\2\2\u03a9"+
		"\u03aa\3\2\2\2\u03aa\u03ab\3\2\2\2\u03ab\u03ac\7\f\2\2\u03acw\3\2\2\2"+
		"\u03ad\u03c6\5N(\2\u03ae\u03b0\7l\2\2\u03af\u03ae\3\2\2\2\u03af\u03b0"+
		"\3\2\2\2\u03b0\u03b1\3\2\2\2\u03b1\u03b3\7Y\2\2\u03b2\u03b4\7\32\2\2\u03b3"+
		"\u03b2\3\2\2\2\u03b3\u03b4\3\2\2\2\u03b4\u03b5\3\2\2\2\u03b5\u03b7\7\t"+
		"\2\2\u03b6\u03b8\5X-\2\u03b7\u03b6\3\2\2\2\u03b7\u03b8\3\2\2\2\u03b8\u03b9"+
		"\3\2\2\2\u03b9\u03ba\7\n\2\2\u03ba\u03bb\7\13\2\2\u03bb\u03bc\5^\60\2"+
		"\u03bc\u03bd\7\f\2\2\u03bd\u03c6\3\2\2\2\u03be\u03c0\7l\2\2\u03bf\u03be"+
		"\3\2\2\2\u03bf\u03c0\3\2\2\2\u03c0\u03c1\3\2\2\2\u03c1\u03c2\5z>\2\u03c2"+
		"\u03c3\7<\2\2\u03c3\u03c4\5|?\2\u03c4\u03c6\3\2\2\2\u03c5\u03ad\3\2\2"+
		"\2\u03c5\u03af\3\2\2\2\u03c5\u03bf\3\2\2\2\u03c6y\3\2\2\2\u03c7\u03ce"+
		"\5\u008cG\2\u03c8\u03ca\7\t\2\2\u03c9\u03cb\5X-\2\u03ca\u03c9\3\2\2\2"+
		"\u03ca\u03cb\3\2\2\2\u03cb\u03cc\3\2\2\2\u03cc\u03ce\7\n\2\2\u03cd\u03c7"+
		"\3\2\2\2\u03cd\u03c8\3\2\2\2\u03ce{\3\2\2\2\u03cf\u03d0\7\13\2\2\u03d0"+
		"\u03d1\5^\60\2\u03d1\u03d2\7\f\2\2\u03d2\u03d5\3\2\2\2\u03d3\u03d5\5r"+
		":\2\u03d4\u03cf\3\2\2\2\u03d4\u03d3\3\2\2\2\u03d5}\3\2\2\2\u03d6\u03d7"+
		"\t\b\2\2\u03d7\177\3\2\2\2\u03d8\u03e0\7=\2\2\u03d9\u03e0\7>\2\2\u03da"+
		"\u03e0\7\u0083\2\2\u03db\u03e0\7\u0084\2\2\u03dc\u03e0\7\6\2\2\u03dd\u03e0"+
		"\5\u0082B\2\u03de\u03e0\5\u0084C\2\u03df\u03d8\3\2\2\2\u03df\u03d9\3\2"+
		"\2\2\u03df\u03da\3\2\2\2\u03df\u03db\3\2\2\2\u03df\u03dc\3\2\2\2\u03df"+
		"\u03dd\3\2\2\2\u03df\u03de\3\2\2\2\u03e0\u0081\3\2\2\2\u03e1\u03e2\t\t"+
		"\2\2\u03e2\u0083\3\2\2\2\u03e3\u03e4\t\n\2\2\u03e4\u0085\3\2\2\2\u03e5"+
		"\u03e6\6D#\2\u03e6\u03e7\5\u008cG\2\u03e7\u03e8\5j\66\2\u03e8\u0087\3"+
		"\2\2\2\u03e9\u03ea\6E$\2\u03ea\u03eb\5\u008cG\2\u03eb\u03ec\5j\66\2\u03ec"+
		"\u0089\3\2\2\2\u03ed\u03f0\7\u0082\2\2\u03ee\u03f0\5\u008eH\2\u03ef\u03ed"+
		"\3\2\2\2\u03ef\u03ee\3\2\2\2\u03f0\u008b\3\2\2\2\u03f1\u03f2\t\13\2\2"+
		"\u03f2\u008d\3\2\2\2\u03f3\u03f7\5\u0090I\2\u03f4\u03f7\7=\2\2\u03f5\u03f7"+
		"\7>\2\2\u03f6\u03f3\3\2\2\2\u03f6\u03f4\3\2\2\2\u03f6\u03f5\3\2\2\2\u03f7"+
		"\u008f\3\2\2\2\u03f8\u03f9\t\f\2\2\u03f9\u0091\3\2\2\2\u03fa\u03ff\7\r"+
		"\2\2\u03fb\u03ff\7\2\2\3\u03fc\u03ff\6J%\2\u03fd\u03ff\6J&\2\u03fe\u03fa"+
		"\3\2\2\2\u03fe\u03fb\3\2\2\2\u03fe\u03fc\3\2\2\2\u03fe\u03fd\3\2\2\2\u03ff"+
		"\u0093\3\2\2\2\u0400\u0401\5\u0096L\2\u0401\u0095\3\2\2\2\u0402\u0408"+
		"\5\u009aN\2\u0403\u0404\7\t\2\2\u0404\u0405\5\u0096L\2\u0405\u0406\7\n"+
		"\2\2\u0406\u0408\3\2\2\2\u0407\u0402\3\2\2\2\u0407\u0403\3\2\2\2\u0408"+
		"\u040c\3\2\2\2\u0409\u040b\5\u0098M\2\u040a\u0409\3\2\2\2\u040b\u040e"+
		"\3\2\2\2\u040c\u040a\3\2\2\2\u040c\u040d\3\2\2\2\u040d\u0097\3\2\2\2\u040e"+
		"\u040c\3\2\2\2\u040f\u0411\7p\2\2\u0410\u0412\7v\2\2\u0411\u0410\3\2\2"+
		"\2\u0411\u0412\3\2\2\2\u0412\u0418\3\2\2\2\u0413\u0419\5\u009aN\2\u0414"+
		"\u0415\7\t\2\2\u0415\u0416\5\u0096L\2\u0416\u0417\7\n\2\2\u0417\u0419"+
		"\3\2\2\2\u0418\u0413\3\2\2\2\u0418\u0414\3\2\2\2\u0419\u0099\3\2\2\2\u041a"+
		"\u041c\5\u00b2Z\2\u041b\u041a\3\2\2\2\u041b\u041c\3\2\2\2\u041c\u041d"+
		"\3\2\2\2\u041d\u041e\7o\2\2\u041e\u0420\5\u009cO\2\u041f\u0421\5\u00b4"+
		"[\2\u0420\u041f\3\2\2\2\u0420\u0421\3\2\2\2\u0421\u0423\3\2\2\2\u0422"+
		"\u0424\5\u00a0Q\2\u0423\u0422\3\2\2\2\u0423\u0424\3\2\2\2\u0424\u0426"+
		"\3\2\2\2\u0425\u0427\5\u00a2R\2\u0426\u0425\3\2\2\2\u0426\u0427\3\2\2"+
		"\2\u0427\u0429\3\2\2\2\u0428\u042a\5\u00b0Y\2\u0429\u0428\3\2\2\2\u0429"+
		"\u042a\3\2\2\2\u042a\u009b\3\2\2\2\u042b\u0430\5\u009eP\2\u042c\u042d"+
		"\7\16\2\2\u042d\u042f\5\u009eP\2\u042e\u042c\3\2\2\2\u042f\u0432\3\2\2"+
		"\2\u0430\u042e\3\2\2\2\u0430\u0431\3\2\2\2\u0431\u009d\3\2\2\2\u0432\u0430"+
		"\3\2\2\2\u0433\u0440\7\32\2\2\u0434\u0437\5\u008cG\2\u0435\u0436\7b\2"+
		"\2\u0436\u0438\5\u008aF\2\u0437\u0435\3\2\2\2\u0437\u0438\3\2\2\2\u0438"+
		"\u0440\3\2\2\2\u0439\u043a\5r:\2\u043a\u043d\5n8\2\u043b\u043c\7b\2\2"+
		"\u043c\u043e\5\u008aF\2\u043d\u043b\3\2\2\2\u043d\u043e\3\2\2\2\u043e"+
		"\u0440\3\2\2\2\u043f\u0433\3\2\2\2\u043f\u0434\3\2\2\2\u043f\u0439\3\2"+
		"\2\2\u0440\u009f\3\2\2\2\u0441\u0442\7c\2\2\u0442\u0443\5\u00a4S\2\u0443"+
		"\u00a1\3\2\2\2\u0444\u0445\7q\2\2\u0445\u0446\5p9\2\u0446\u00a3\3\2\2"+
		"\2\u0447\u044c\5\u00a6T\2\u0448\u0449\7\16\2\2\u0449\u044b\5\u00a6T\2"+
		"\u044a\u0448\3\2\2\2\u044b\u044e\3\2\2\2\u044c\u044a\3\2\2\2\u044c\u044d"+
		"\3\2\2\2\u044d\u00a5\3\2\2\2\u044e\u044c\3\2\2\2\u044f\u0455\5\u00a8U"+
		"\2\u0450\u0451\7\t\2\2\u0451\u0452\5\u00a8U\2\u0452\u0453\7\n\2\2\u0453"+
		"\u0455\3\2\2\2\u0454\u044f\3\2\2\2\u0454\u0450\3\2\2\2\u0455\u00a7\3\2"+
		"\2\2\u0456\u0458\5\u00aaV\2\u0457\u0459\5\u00aeX\2\u0458\u0457\3\2\2\2"+
		"\u0458\u0459\3\2\2\2\u0459\u045d\3\2\2\2\u045a\u045c\5\u00acW\2\u045b"+
		"\u045a\3\2\2\2\u045c\u045f\3\2\2\2\u045d\u045b\3\2\2\2\u045d\u045e\3\2"+
		"\2\2\u045e\u00a9\3\2\2\2\u045f\u045d\3\2\2\2\u0460\u046a\7n\2\2\u0461"+
		"\u0462\5r:\2\u0462\u0463\5l\67\2\u0463\u046a\3\2\2\2\u0464\u046a\5\u008c"+
		"G\2\u0465\u0466\7\t\2\2\u0466\u0467\5\u0096L\2\u0467\u0468\7\n\2\2\u0468"+
		"\u046a\3\2\2\2\u0469\u0460\3\2\2\2\u0469\u0461\3\2\2\2\u0469\u0464\3\2"+
		"\2\2\u0469\u0465\3\2\2\2\u046a\u00ab\3\2\2\2\u046b\u046c\7r\2\2\u046c"+
		"\u0475\5\u00a4S\2\u046d\u046e\7r\2\2\u046e\u046f\5\u00a4S\2\u046f\u0470"+
		"\7s\2\2\u0470\u0471\5r:\2\u0471\u0472\t\r\2\2\u0472\u0473\5r:\2\u0473"+
		"\u0475\3\2\2\2\u0474\u046b\3\2\2\2\u0474\u046d\3\2\2\2\u0475\u00ad\3\2"+
		"\2\2\u0476\u0477\7u\2\2\u0477\u047b\5\u00b6\\\2\u0478\u0479\7u\2\2\u0479"+
		"\u047b\5r:\2\u047a\u0476\3\2\2\2\u047a\u0478\3\2\2\2\u047b\u00af\3\2\2"+
		"\2\u047c\u047d\7t\2\2\u047d\u047e\5r:\2\u047e\u00b1\3\2\2\2\u047f\u0480"+
		"\7u\2\2\u0480\u0481\5r:\2\u0481\u00b3\3\2\2\2\u0482\u0483\7w\2\2\u0483"+
		"\u0488\5r:\2\u0484\u0485\7\16\2\2\u0485\u0487\5r:\2\u0486\u0484\3\2\2"+
		"\2\u0487\u048a\3\2\2\2\u0488\u0486\3\2\2\2\u0488\u0489\3\2\2\2\u0489\u00b5"+
		"\3\2\2\2\u048a\u0488\3\2\2\2\u048b\u0494\7\13\2\2\u048c\u0491\5\u00b8"+
		"]\2\u048d\u048e\7\16\2\2\u048e\u0490\5\u00b8]\2\u048f\u048d\3\2\2\2\u0490"+
		"\u0493\3\2\2\2\u0491\u048f\3\2\2\2\u0491\u0492\3\2\2\2\u0492\u0495\3\2"+
		"\2\2\u0493\u0491\3\2\2\2\u0494\u048c\3\2\2\2\u0494\u0495\3\2\2\2\u0495"+
		"\u0497\3\2\2\2\u0496\u0498\7\16\2\2\u0497\u0496\3\2\2\2\u0497\u0498\3"+
		"\2\2\2\u0498\u0499\3\2\2\2\u0499\u049a\7\f\2\2\u049a\u00b7\3\2\2\2\u049b"+
		"\u049c\5j\66\2\u049c\u049d\7\21\2\2\u049d\u049e\5r:\2\u049e\u00b9\3\2"+
		"\2\2\u0089\u00bb\u00be\u00d8\u00dc\u00e3\u00e9\u00ed\u00f4\u00fc\u0101"+
		"\u0103\u010c\u0110\u0118\u011d\u0126\u012a\u0132\u0136\u013b\u0146\u014c"+
		"\u015b\u016f\u0173\u0177\u017f\u0188\u018d\u0195\u019c\u01a3\u01aa\u01bc"+
		"\u01c0\u01c2\u01c9\u01cf\u01d4\u01e3\u01e6\u01eb\u01ee\u01f9\u01fd\u0202"+
		"\u020f\u0215\u021e\u0220\u0229\u022d\u0233\u0236\u0239\u023e\u0246\u0249"+
		"\u0253\u0256\u025b\u0262\u0269\u026e\u0271\u0276\u027c\u0281\u028a\u028e"+
		"\u0293\u0298\u029e\u02a2\u02b1\u02b4\u02b9\u02d0\u02d3\u02dc\u02e4\u02e8"+
		"\u02ea\u02ef\u02f3\u02fa\u0301\u0311\u0333\u0336\u0342\u0382\u0386\u0393"+
		"\u0395\u039b\u03a3\u03a6\u03a9\u03af\u03b3\u03b7\u03bf\u03c5\u03ca\u03cd"+
		"\u03d4\u03df\u03ef\u03f6\u03fe\u0407\u040c\u0411\u0418\u041b\u0420\u0423"+
		"\u0426\u0429\u0430\u0437\u043d\u043f\u044c\u0454\u0458\u045d\u0469\u0474"+
		"\u047a\u0488\u0491\u0494\u0497";
	public static final ATN _ATN =
		new ATNDeserializer().deserialize(_serializedATN.toCharArray());
	static {
		_decisionToDFA = new DFA[_ATN.getNumberOfDecisions()];
		for (int i = 0; i < _ATN.getNumberOfDecisions(); i++) {
			_decisionToDFA[i] = new DFA(_ATN.getDecisionState(i), i);
		}
	}
}