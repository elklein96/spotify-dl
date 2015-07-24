command -v brew >/dev/null 2>&1 || { ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"; brew install node; brew install npm; }
command -v node >/dev/null 2>&1 || { brew install node; brew install npm; }
command -v youtube-dl >/dev/null 2>&1 || { brew install youtube-dl; }

DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )

cd $DIR

npm install