
mkdir -p ../../dist/parser
antlr4 -Dlanguage=JavaScript *.g4 -o ../parser -visitor -no-listener; cp ../parser/* ../../dist/parser