select css('#sel1'), css('#sel2')
from SourceA using { 'reducer': reducerFunction }