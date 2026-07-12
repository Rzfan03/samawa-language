export const syntax = {
  "ada": "local",
  "untu": "while",
  "selama": "while",
  "ulang": "repeat",
  "boat": "do",
  "lamen": "if",
  "tres": "then",
  "lamen_no": "else",
  "lamen_no_kebali": "elseif",
  "jure_mo": "end",
  "untuk": "for",
  "sampe": "until",
  "jangka_mo": "break",
  "fungsi": "function",
  "semalik": "return",
  "tulis": "print",
  "nda_isi": "nil",
  "no": "not",
  "dan": "and",
  "atau": "or",
  "tutu": "true",
  "siong": "false",
  "lalo": "goto",
  "kenang": "require",
  "#": "--",
};

// Sort by length descending so longer keywords are replaced first
// This prevents partial matches (e.g. "lamen_no" before "lamen")
export const sortedKeywords = Object.keys(syntax).sort((a, b) => b.length - a.length);
