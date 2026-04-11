-- samalang compiler

local syntax = require('syntax')

function Compile(teks)
    local hasil = teks
    for sl, lua in pairs(syntax) do
        local pola = "%f[%a]" .. sl .. "%f[%A]"
        hasil = hasil:gsub(pola, lua)
    end
    return hasil
end

local namaFile = arg[1]
if not namaFile then
    print("Penggunaan: sl <nama_file.sl>")
    os.exit()
end

local f = io.open(namaFile, "r")

if f then
    local isiFile = f:read("*all")

    f:close()

    local kodeLua = Compile(isiFile)

    local jalankan, err = load(kodeLua)


    if jalankan then
        jalankan()
    else
        print("Kesalahan Sintaks di " .. namaFile .. ": " .. err)
    end
else
    print("Error: File '" .. namaFile .. "' tidak ditemukan!")
end
