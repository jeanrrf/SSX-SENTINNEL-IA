import os
import json
import subprocess
import re
import logging
import argparse
import sys

try:
    import colorlog
except ImportError:
    colorlog = None

LOG_FILE = 'ts_errors.log'
ERROR_LOG = 'error_fixer.log'
REPORT_FILE = 'error_report.txt'
TS_CONFIG = 'tsconfig.json'

def setup_logger():
    """Setup a colored logger and log to a file."""
    logger = logging.getLogger("TSFixer")
    logger.setLevel(logging.DEBUG)

    formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')

    console_handler = logging.StreamHandler()
    if colorlog:
        console_handler.setFormatter(colorlog.ColoredFormatter(
            '%(log_color)s%(asctime)s - %(levelname)s - %(message)s',
            log_colors={
                'DEBUG': 'cyan',
                'INFO': 'green',
                'WARNING': 'yellow',
                'ERROR': 'red',
                'CRITICAL': 'bold_red',
            }
        ))
    else:
        console_handler.setFormatter(formatter)

    file_handler = logging.FileHandler(ERROR_LOG, encoding='utf-8')
    file_handler.setFormatter(formatter)

    logger.addHandler(console_handler)
    logger.addHandler(file_handler)
    return logger

logger = setup_logger()

CATEGORIES = {
    "type_errors": r"Type '.*' is not assignable to type '.*'",
    "missing_modules": r"Cannot find module '(.*?)'",
    "broken_imports": r"Module not found: Can't resolve '(.*?)'",
    "incorrect_settings": r"Property '(.*?)' does not exist in type 'CompilerOptions'",
    "others": r".*"
}

def change_directory(directory):
    """Change to the specified directory and log it."""
    logger.debug(f"Trying to change to directory: {directory}")
    if os.path.exists(directory):
        os.chdir(directory)
        logger.info(f"Directory changed to: {os.getcwd()}")
    else:
        logger.warning(f"Directory '{directory}' not found.")

def read_error_log():
    """Read the logged errors from the log file."""
    logger.debug("Reading errors from the log file...")
    if os.path.exists(LOG_FILE):
        try:
            with open(LOG_FILE, 'r', encoding='utf-8') as f:
                return f.read()
        except Exception as e:
            logger.error(f"Error reading log file '{LOG_FILE}': {e}")
    else:
        logger.warning(f"Log file '{LOG_FILE}' not found.")
    return ""

def fix_missing_modules(errors):
    """Check and install missing modules in the project."""
    packages = {match.group(1) for error in errors if (match := re.search(CATEGORIES["missing_modules"], error))}
    
    if packages:
        logger.info(f"Installing missing packages: {', '.join(packages)}")
        try:
            result = subprocess.run(["npm", "install", "--save-dev"] + list(packages), capture_output=True, text=True, check=True)
            logger.debug(f"npm install output: {result.stdout}")
        except subprocess.CalledProcessError as e:
            logger.error(f"Error installing packages: {e.stderr}")

def fix_incorrect_settings(errors):
    """Fix invalid settings in tsconfig.json."""
    if not os.path.exists(TS_CONFIG):
        logger.warning(f"File {TS_CONFIG} not found.")
        return
    
    try:
        with open(TS_CONFIG, 'r', encoding='utf-8') as f:
            config = json.load(f)
    except json.JSONDecodeError as e:
        logger.error(f"Error reading {TS_CONFIG}: {e}")
        return

    changed = False
    for error in errors:
        if (match := re.search(CATEGORIES["incorrect_settings"], error)):
            key = match.group(1)
            if not config.get("compilerOptions", {}).get(key):
                if key in ["strict", "noImplicitAny", "strictNullChecks"]:
                    config.setdefault("compilerOptions", {})[key] = True
                elif key in ["target", "module"]:
                    config.setdefault("compilerOptions", {})[key] = "esnext"
                else:
                    config.setdefault("compilerOptions", {})[key] = None
                changed = True

    if changed:
        try:
            with open(TS_CONFIG, 'w', encoding='utf-8') as f:
                json.dump(config, f, indent=2)
            logger.info("tsconfig.json updated successfully.")
        except Exception as e:
            logger.error(f"Error updating {TS_CONFIG}: {e}")

def generate_report(errors):
    """Generate a report of the errors that couldn't be fixed."""
    logger.debug("Generating error report...")
    try:
        with open(REPORT_FILE, 'w', encoding='utf-8') as f:
            for error in errors:
                f.write(f"{error}\n")
        logger.info(f"Error report generated: {REPORT_FILE}")
    except Exception as e:
        logger.error(f"Error generating report: {e}")

def process_errors():
    """Process and auto-fix found errors."""
    logger.debug("Starting to process errors...")
    log = read_error_log()
    if not log:
        logger.info("No errors found in the log.")
        return
    
    errors = [line.strip() for line in log.split('\n') if line.strip()]
    handle_errors(errors)
    logger.info("Fixes applied!")

def handle_errors(errors):
    """Handle different types of errors."""
    fix_missing_modules(errors)
    fix_incorrect_settings(errors)
    handle_remaining_errors(errors)

def handle_remaining_errors(errors):
    """Handle remaining errors that couldn't be fixed."""
    remaining_errors = [error for error in errors if re.search(CATEGORIES["others"], error)]
    if remaining_errors:
        generate_report(remaining_errors)

def open_terminal_and_reexecute():
    """Open a terminal and re-execute the script."""
    script_path = os.path.abspath(__file__)
    logger.debug("Opening terminal to re-execute the script...")

    if sys.platform.startswith('win'):
        logger.debug("Detected Windows platform.")
        subprocess.run(f'start cmd /k python "{script_path}" --process', shell=True)
    elif sys.platform.startswith('linux'):
        logger.debug("Detected Linux platform.")
        subprocess.run(["gnome-terminal", "--", "python3", script_path, "--process"], check=False)
    elif sys.platform.startswith('darwin'):
        logger.debug("Detected macOS platform.")
        subprocess.run(f'osascript -e \'tell application "Terminal" to do script "python3 {script_path} --process"\'', shell=True)
    else:
        logger.error("Unsupported operating system for automatic terminal opening.")

def main():
    """Main function to run via terminal."""
    logger.debug("Starting main function...")
    logger.debug(f"Current working directory: {os.getcwd()}")
    parser = argparse.ArgumentParser(description="A tool to automatically fix common TypeScript errors by reading a log file, installing missing modules, and updating tsconfig.json settings.")
    parser.add_argument('--process', action='store_true', help="Process errors from the log")

    args = parser.parse_args()
    
    if args.process:
        logger.debug("Process argument detected.")
        process_errors()
    else:
        logger.debug("No process argument detected, opening terminal.")
        open_terminal_and_reexecute()

if __name__ == "__main__":
    main()