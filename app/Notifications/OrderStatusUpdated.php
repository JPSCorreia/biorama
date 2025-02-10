<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\DatabaseMessage;

class OrderStatusUpdated extends Notification implements ShouldQueue
{
    use Queueable;

    private $order;
    private $status;
    private $storeName;

    public function __construct($order, $status, $storeName)
    {
        $this->order = $order;
        $this->status = $status;
        $this->storeName = $storeName;
    }

    public function via($notifiable)
    {
        return ['database'];
    }

    public function toDatabase($notifiable)
    {
        $message = match ($this->status) {
            'shipped' => "A sua encomenda da loja {$this->storeName} foi enviada!",
            'canceled' => "A sua encomenda da loja {$this->storeName} foi cancelada.",
            default => "A encomenda teve uma atualização de estado.",
        };

        return [
            'order_id' => $this->order->id,
            'status' => $this->status,
            'store_name' => $this->storeName,
            'message' => $message,
        ];
    }
}
