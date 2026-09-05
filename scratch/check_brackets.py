import sys

def check_brackets(file_path):
    stack = []
    brackets = {'(': ')', '{': '}', '[': ']'}
    reverse_brackets = {v: k for k, v in brackets.items()}
    lines = []
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
        
    for line_num, line in enumerate(lines, 1):
        for col_num, char in enumerate(line, 1):
            if char in brackets:
                stack.append((char, line_num, col_num))
            elif char in reverse_brackets:
                if not stack:
                    print(f"Unmatched {char} at line {line_num}, col {col_num}")
                    return
                top, top_line, top_col = stack.pop()
                if brackets[top] != char:
                    print(f"Mismatched {char} at line {line_num}, col {col_num}. Expected {brackets[top]} to close {top} from line {top_line}")
                    return
    if stack:
        print(f"Unclosed brackets: {stack}")
    else:
        print("Brackets are balanced.")

check_brackets(sys.argv[1])
