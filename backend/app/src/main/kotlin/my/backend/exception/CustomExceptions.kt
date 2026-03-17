package my.backend.exception

class InvalidOriginException(message: String) : RuntimeException(message)

class TurnstileVerificationException(message: String) : RuntimeException(message)

class DuplicateTagException(name: String) : RuntimeException("タグ「$name」はすでに存在します。")
