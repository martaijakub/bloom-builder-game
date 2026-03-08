import { useState, useCallback, useEffect, useRef } from "react";
import { useLang } from "@/contexts/LangContext";
import { Lock, Settings, Save, X, Plus, Trash2, GripVertical, Search, Download } from "lucide-react";
import seatingData from "@/data/seatingPlan.json";

// ---- Types ----
interface Guest {
  id: string;
  name: string;
  perimeterPos?: number;
}

interface TableData {
  id: string;
  label: string;
  guests: Guest[];
  x: number;
  y: number;
  width: number;
  height: number;
}

const STORAGE_KEY = "wedding_seating_plan_admin";
const ADMIN_PASS = "ADMIN2026";

// Guests always see the JSON file data
function getPublicTables(): TableData[] {
  return seatingData as TableData[];
}

// Admin loads from localStorage (draft), falls back to JSON
function loadAdminTables(): TableData[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return seatingData as TableData[];
}

function saveAdminTables(tables: TableData[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tables));
}

// Export current admin layout as JSON for copying into seatingPlan.json
function exportTablesJSON(tables: TableData[]) {
  const json = JSON.stringify(tables, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "seatingPlan.json";
  a.click();
  URL.revokeObjectURL(url);
}

// ---- Admin password modal ----
const AdminLoginModal = ({
  open,
  onClose,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) => {
  const { t } = useLang();
  const [pw, setPw] = useState("");
  const [error, setError] = useState(false);

  if (!open) return null;

  const submit = () => {
    if (pw.trim().toUpperCase() === ADMIN_PASS) {
      onSuccess();
      setPw("");
      setError(false);
    } else {
      setError(true);
      setPw("");
    }
  };

  return (
    <div className="fixed inset-0 z-[3000] bg-foreground/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-card border border-border/60 p-8 text-center relative max-w-xs w-full">
        <button onClick={onClose} className="absolute top-3 right-3 text-muted-foreground hover:text-foreground">
          <X className="w-4 h-4" />
        </button>
        <Lock className="w-6 h-6 text-wedding-gold mx-auto mb-3" />
        <h3 className="font-serif text-xl font-light mb-4">{t("Tryb admina", "Admin Mode")}</h3>
        <input
          type="password"
          value={pw}
          onChange={(e) => { setPw(e.target.value); setError(false); }}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder={t("Hasło", "Password")}
          className="w-full px-4 py-3 bg-background border border-border font-sans text-sm mb-3 focus:outline-none focus:border-wedding-gold"
        />
        {error && <p className="text-xs text-destructive mb-2">{t("Błędne hasło", "Wrong password")}</p>}
        <button
          onClick={submit}
          className="w-full bg-primary text-primary-foreground py-2.5 font-sans text-xs uppercase tracking-[0.2em]"
        >
          {t("Zaloguj", "Login")}
        </button>
      </div>
    </div>
  );
};

// ---- Rectangle table visual component ----
const perimeterToXY = (pos: number, w: number, h: number): { x: number; y: number } => {
  const perimeter = 2 * (w + h);
  let dist = ((pos % 1) + 1) % 1 * perimeter; // normalize to 0-perimeter
  if (dist < w) {
    return { x: dist - w / 2, y: -h / 2 - 22 };
  } else if (dist < w + h) {
    return { x: w / 2 + 22, y: (dist - w) - h / 2 };
  } else if (dist < 2 * w + h) {
    return { x: w / 2 - (dist - w - h), y: h / 2 + 22 };
  } else {
    return { x: -w / 2 - 22, y: h / 2 - (dist - 2 * w - h) };
  }
};

const xyToPerimeter = (mx: number, my: number, w: number, h: number): number => {
  // Project mouse position (relative to table center) onto nearest perimeter point
  const perimeter = 2 * (w + h);
  // Clamp to edges and find closest edge
  const halfW = w / 2, halfH = h / 2;
  const candidates: { dist: number; perim: number }[] = [];
  // Top edge
  const tx = Math.max(-halfW, Math.min(halfW, mx));
  candidates.push({ dist: (tx - mx) ** 2 + (-halfH - my) ** 2, perim: tx + halfW });
  // Right edge
  const ry = Math.max(-halfH, Math.min(halfH, my));
  candidates.push({ dist: (halfW - mx) ** 2 + (ry - my) ** 2, perim: w + (ry + halfH) });
  // Bottom edge
  const bx = Math.max(-halfW, Math.min(halfW, mx));
  candidates.push({ dist: (bx - mx) ** 2 + (halfH - my) ** 2, perim: w + h + (halfW - bx) });
  // Left edge
  const ly = Math.max(-halfH, Math.min(halfH, my));
  candidates.push({ dist: (-halfW - mx) ** 2 + (ly - my) ** 2, perim: 2 * w + h + (halfH - ly) });
  
  candidates.sort((a, b) => a.dist - b.dist);
  return candidates[0].perim / perimeter;
};

const TableVisual = ({
  table,
  isAdmin,
  highlighted,
  onDragStart,
  onEdit,
  onDelete,
  onUpdateGuests,
  onSelect,
}: {
  table: TableData;
  isAdmin: boolean;
  highlighted?: boolean;
  onDragStart?: (e: React.MouseEvent, id: string) => void;
  onEdit?: (table: TableData) => void;
  onDelete?: (id: string) => void;
  onUpdateGuests?: (tableId: string, guests: Guest[]) => void;
  onSelect?: (table: TableData) => void;
}) => {
  const { t } = useLang();
  const guestCount = table.guests.length;
  const { width, height } = table;
  const tableRectRef = useRef<HTMLDivElement>(null);
  const tableWrapperRef = useRef<HTMLDivElement>(null);

  // Ensure all guests have perimeterPos
  const guestsWithPos = table.guests.map((g, i) => ({
    ...g,
    perimeterPos: g.perimeterPos ?? (guestCount > 0 ? i / guestCount : 0),
  }));

  const handleSeatDragStart = useCallback((e: React.MouseEvent, guestId: string) => {
    if (!isAdmin || !tableRectRef.current) return;
    e.preventDefault();
    e.stopPropagation();

    const onMove = (me: MouseEvent) => {
      if (!tableRectRef.current) return;
      const rect = tableRectRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const mx = me.clientX - cx;
      const my = me.clientY - cy;
      const newPos = xyToPerimeter(mx, my, width, height);
      
      const updated = guestsWithPos.map((g) =>
        g.id === guestId ? { ...g, perimeterPos: newPos } : g
      );
      onUpdateGuests?.(table.id, updated);
    };

    const onUp = () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  }, [isAdmin, width, height, guestsWithPos, table.id, onUpdateGuests]);

  const handleClick = () => {
    if (!isAdmin && highlighted && onSelect) {
      onSelect(table);
      tableWrapperRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <div
      ref={tableWrapperRef}
      className={`absolute -translate-x-1/2 -translate-y-1/2 group ${
        isAdmin ? "cursor-grab active:cursor-grabbing" : highlighted ? "cursor-pointer" : ""
      }`}
      style={{ left: `${table.x}%`, top: `${table.y}%` }}
      onMouseDown={isAdmin && onDragStart ? (e) => onDragStart(e, table.id) : undefined}
      onClick={handleClick}
    >
      {/* Table rectangle */}
      <div
        ref={tableRectRef}
        className={`border-2 flex items-center justify-center shadow-md relative rounded-sm transition-all duration-500 ${
          highlighted
            ? "bg-wedding-gold/20 border-wedding-gold ring-2 ring-wedding-gold/40 scale-105"
            : "bg-wedding-warm border-wedding-gold/30"
        }`}
        style={{ width, height }}
      >
        <div className="text-center">
          <p className="font-serif text-sm font-medium text-foreground leading-tight">{table.label}</p>
          <p className="font-sans text-[10px] text-muted-foreground">{guestCount} {t("os.", "ppl")}</p>
        </div>

        {/* Guest seats around the table */}
        {guestsWithPos.map((guest) => {
          const pos = perimeterToXY(guest.perimeterPos, width, height);
          return (
            <div
              key={guest.id}
              className={`absolute flex items-center justify-center ${
                isAdmin ? "cursor-grab active:cursor-grabbing z-10 hover:z-20" : ""
              }`}
              style={{
                left: `calc(50% + ${pos.x}px)`,
                top: `calc(50% + ${pos.y}px)`,
                transform: "translate(-50%, -50%)",
              }}
              onMouseDown={isAdmin ? (e) => handleSeatDragStart(e, guest.id) : undefined}
            >
              <div className={`bg-card border rounded px-2 py-0.5 shadow-sm whitespace-nowrap transition-shadow ${
                isAdmin ? "border-primary/40 hover:shadow-md hover:border-primary" : "border-border/60"
              }`}>
                <span className="font-sans text-[9px] text-foreground">{guest.name}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Admin controls */}
      {isAdmin && (
        <div className="absolute -top-3 -right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => { e.stopPropagation(); onEdit?.(table); }}
            className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs shadow"
          >
            <Settings className="w-3 h-3" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete?.(table.id); }}
            className="w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center text-xs shadow"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
};

// ---- Table editor modal ----
const TableEditor = ({
  table,
  onSave,
  onClose,
}: {
  table: TableData;
  onSave: (updated: TableData) => void;
  onClose: () => void;
}) => {
  const { t } = useLang();
  const [label, setLabel] = useState(table.label);
  const [guests, setGuests] = useState<Guest[]>([...table.guests]);
  const [width, setWidth] = useState(table.width);
  const [height, setHeight] = useState(table.height);

  const addGuest = () => {
    setGuests([...guests, { id: `g_${Date.now()}`, name: "" }]);
  };

  const removeGuest = (id: string) => {
    setGuests(guests.filter((g) => g.id !== id));
  };

  const updateGuest = (id: string, name: string) => {
    setGuests(guests.map((g) => (g.id === id ? { ...g, name } : g)));
  };

  const handleSave = () => {
    onSave({ ...table, label, guests: guests.filter((g) => g.name.trim()), width, height });
  };

  return (
    <div className="fixed inset-0 z-[3000] bg-foreground/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-card border border-border/60 p-8 relative max-w-sm w-full max-h-[80vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-3 right-3 text-muted-foreground hover:text-foreground">
          <X className="w-4 h-4" />
        </button>

        <h3 className="font-serif text-xl font-light mb-5">{t("Edytuj stół", "Edit Table")}</h3>

        <label className="block mb-2 font-sans text-xs tracking-wider uppercase text-muted-foreground">
          {t("Nazwa stołu", "Table Name")}
        </label>
        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          className="w-full px-3 py-2 bg-background border border-border font-sans text-sm mb-5 focus:outline-none focus:border-wedding-gold"
        />

        {/* Size controls */}
        <div className="grid grid-cols-2 gap-4 mb-5">
          <div>
            <label className="block mb-2 font-sans text-xs tracking-wider uppercase text-muted-foreground">
              {t("Szerokość", "Width")} ({width}px)
            </label>
            <input
              type="range"
              min="100"
              max="300"
              value={width}
              onChange={(e) => setWidth(Number(e.target.value))}
              className="w-full accent-primary"
            />
          </div>
          <div>
            <label className="block mb-2 font-sans text-xs tracking-wider uppercase text-muted-foreground">
              {t("Wysokość", "Height")} ({height}px)
            </label>
            <input
              type="range"
              min="50"
              max="150"
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              className="w-full accent-primary"
            />
          </div>
        </div>

        <label className="block mb-2 font-sans text-xs tracking-wider uppercase text-muted-foreground">
          {t("Goście", "Guests")}
        </label>
        <div className="space-y-2 mb-4">
          {guests.map((g) => (
            <div key={g.id} className="flex gap-2">
              <input
                value={g.name}
                onChange={(e) => updateGuest(g.id, e.target.value)}
                placeholder={t("Imię i nazwisko", "Full name")}
                className="flex-1 px-3 py-2 bg-background border border-border font-sans text-sm focus:outline-none focus:border-wedding-gold"
              />
              <button
                onClick={() => removeGuest(g.id)}
                className="px-2 text-destructive hover:text-destructive/80"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={addGuest}
          className="flex items-center gap-1.5 font-sans text-xs text-primary hover:text-primary/80 mb-6"
        >
          <Plus className="w-3.5 h-3.5" /> {t("Dodaj gościa", "Add guest")}
        </button>

        <button
          onClick={handleSave}
          className="w-full bg-primary text-primary-foreground py-2.5 font-sans text-xs uppercase tracking-[0.2em]"
        >
          <Save className="w-3.5 h-3.5 inline mr-2" />
          {t("Zapisz", "Save")}
        </button>
      </div>
    </div>
  );
};

// ---- Main Seating Plan ----
const SeatingPlan = ({ isAdmin: isAdminProp }: { isAdmin?: boolean }) => {
  const { t } = useLang();
  const [adminMode, setAdminMode] = useState(false);
  const isAdmin = adminMode || !!isAdminProp;

  // Admin sees draft from localStorage; guests see the committed JSON file
  const [tables, setTables] = useState<TableData[]>(() =>
    isAdmin ? loadAdminTables() : getPublicTables()
  );
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [editingTable, setEditingTable] = useState<TableData | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTable, setSelectedTable] = useState<TableData | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef<string | null>(null);

  // Switch data source when admin mode toggles
  useEffect(() => {
    setTables(isAdmin ? loadAdminTables() : getPublicTables());
  }, [isAdmin]);

  // Find table IDs matching the search query
  const highlightedTableIds = searchQuery.trim().length >= 2
    ? tables
        .filter((t) =>
          t.guests.some((g) =>
            g.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
          )
        )
        .map((t) => t.id)
    : [];

  const handleDragStart = useCallback((e: React.MouseEvent, tableId: string) => {
    if (!isAdmin) return;
    e.preventDefault();
    draggingRef.current = tableId;

    const onMove = (me: MouseEvent) => {
      if (!draggingRef.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = Math.max(5, Math.min(95, ((me.clientX - rect.left) / rect.width) * 100));
      const y = Math.max(5, Math.min(95, ((me.clientY - rect.top) / rect.height) * 100));
      setTables((prev) =>
        prev.map((t) => (t.id === draggingRef.current ? { ...t, x, y } : t))
      );
    };

    const onUp = () => {
      draggingRef.current = null;
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
      setTables((prev) => {
        saveAdminTables(prev);
        return prev;
      });
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  }, [isAdmin]);

  const addTable = () => {
    const newTable: TableData = {
      id: `t_${Date.now()}`,
      label: `Stół ${tables.length + 1}`,
      guests: [],
      x: 50,
      y: 50,
      width: 160,
      height: 70,
    };
    const updated = [...tables, newTable];
    setTables(updated);
    saveAdminTables(updated);
    setEditingTable(newTable);
  };

  const deleteTable = (id: string) => {
    const updated = tables.filter((t) => t.id !== id);
    setTables(updated);
    saveAdminTables(updated);
  };

  const saveEditedTable = (updated: TableData) => {
    const newTables = tables.map((t) => (t.id === updated.id ? updated : t));
    setTables(newTables);
    saveAdminTables(newTables);
    setEditingTable(null);
  };

  const updateTableGuests = useCallback((tableId: string, guests: Guest[]) => {
    setTables((prev) => {
      const updated = prev.map((t) => (t.id === tableId ? { ...t, guests } : t));
      saveTables(updated);
      return updated;
    });
  }, []);

  return (
    <div>
      {/* Admin toggle */}
      <div className="flex justify-center mb-8">
        {!isAdmin ? (
          <button
            onClick={() => setShowAdminLogin(true)}
            className="flex items-center gap-2 font-sans text-xs tracking-wider uppercase text-muted-foreground hover:text-foreground transition-colors border border-border/60 px-4 py-2"
          >
            <Settings className="w-3.5 h-3.5" />
            {t("Tryb admina", "Admin Mode")}
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <span className="font-sans text-xs text-wedding-gold uppercase tracking-wider flex items-center gap-1.5">
              <Settings className="w-3.5 h-3.5" />
              {t("Tryb admina", "Admin Mode")}
            </span>
            <button
              onClick={addTable}
              className="flex items-center gap-1.5 font-sans text-xs text-primary hover:text-primary/80 border border-primary/30 px-3 py-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> {t("Dodaj stół", "Add Table")}
            </button>
            <button
              onClick={() => setAdminMode(false)}
              className="font-sans text-xs text-muted-foreground hover:text-foreground border border-border/60 px-3 py-1.5"
            >
              {t("Zamknij", "Exit")}
            </button>
          </div>
        )}
      </div>

      {/* Guest search */}
      {!isAdmin && (
        <div className="relative max-w-sm mx-auto mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("Wyszukaj gościa…", "Search guest…")}
            className="w-full pl-10 pr-4 py-2.5 bg-background border border-border/60 font-sans text-sm focus:outline-none focus:border-wedding-gold transition-colors"
          />
          {searchQuery.trim().length >= 2 && (
            <p className="font-sans text-xs text-muted-foreground mt-1.5 text-center">
              {highlightedTableIds.length > 0
                ? t(
                    `Znaleziono przy ${highlightedTableIds.length} ${highlightedTableIds.length === 1 ? "stole" : "stołach"}`,
                    `Found at ${highlightedTableIds.length} ${highlightedTableIds.length === 1 ? "table" : "tables"}`
                  )
                : t("Nie znaleziono gościa", "Guest not found")}
            </p>
          )}
        </div>
      )}

      {/* Floor plan */}
      <div
        ref={containerRef}
        className="relative w-full bg-wedding-warm/30 border border-border/40 overflow-hidden"
        style={{ aspectRatio: "16 / 10", minHeight: 400 }}
      >
        {/* Dance floor indicator */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 font-sans text-[10px] uppercase tracking-[0.2em] text-muted-foreground/50">
          {t("Parkiet", "Dance Floor")} ↑
        </div>
        <div className="absolute top-8 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full border border-dashed border-wedding-gold/20" />

        {tables.map((table) => (
          <TableVisual
            key={table.id}
            table={table}
            isAdmin={isAdmin}
            highlighted={highlightedTableIds.includes(table.id)}
            onDragStart={handleDragStart}
            onEdit={setEditingTable}
            onDelete={deleteTable}
            onUpdateGuests={updateTableGuests}
            onSelect={setSelectedTable}
          />
        ))}
      </div>

      {/* Selected table detail */}
      {!isAdmin && selectedTable && (
        <div className="mt-6 border border-wedding-gold/40 bg-wedding-gold/5 p-6 max-w-md mx-auto animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-serif text-lg font-light text-foreground">{selectedTable.label}</h4>
            <button
              onClick={() => setSelectedTable(null)}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <ul className="space-y-1.5">
            {selectedTable.guests.map((g) => (
              <li key={g.id} className="font-sans text-sm text-foreground flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-wedding-gold/60" />
                {g.name}
              </li>
            ))}
          </ul>
          {selectedTable.guests.length === 0 && (
            <p className="font-sans text-xs text-muted-foreground">{t("Brak gości", "No guests")}</p>
          )}
        </div>
      )}

      {/* Legend */}
      {!isAdmin && (
        <div className="mt-8 text-center">
          <p className="font-sans text-xs text-muted-foreground">
            {t(
              "Kliknij na podświetlony stół, aby zobaczyć listę gości.",
              "Click a highlighted table to see the guest list."
            )}
          </p>
        </div>
      )}

      {/* Modals */}
      <AdminLoginModal
        open={showAdminLogin}
        onClose={() => setShowAdminLogin(false)}
        onSuccess={() => {
          setAdminMode(true);
          setShowAdminLogin(false);
        }}
      />

      {editingTable && (
        <TableEditor
          table={editingTable}
          onSave={saveEditedTable}
          onClose={() => setEditingTable(null)}
        />
      )}
    </div>
  );
};

export default SeatingPlan;
